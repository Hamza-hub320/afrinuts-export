import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaCheckCircle,
    FaClock,
    FaPlay,
    FaCalendarAlt,
    FaUser,
    FaTasks,
    FaSpinner,
    FaUserCheck,
    FaChartPie,
    FaTimes,
    FaHistory,
    FaPhone,
    FaEnvelope,
    FaUserCircle
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { staggerContainer, fadeIn } from '@/utils/animations';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { useNavigate } from "react-router-dom";

const isDevelopment = import.meta.env.DEV;

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    type: string;
    dueDate: number;
    completedDate?: number;
    blockId: number;
}

interface TaskAssignment {
    id: number;
    taskId: number;
    assignedTo: string;
    assignedAt: number;
    unassignedAt?: number;
}

interface TaskWithAssignments extends Task {
    assignments?: TaskAssignment[];
    currentWorker?: string;
}

// Extended assignment info for modal
interface AssignmentWithDetails extends TaskAssignment {
    workerName: string;
    workerRole?: string;
    workerEmail?: string;
    workerPhone?: string;
    daysWorked?: number;
}

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<TaskWithAssignments[]>([]);
    const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
    const [loading, setLoading] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithDetails | null>(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let tasksData, assignmentsData;

                if (isDevelopment) {
                    tasksData = await getMockData('getTasks');
                    assignmentsData = await getMockData('getAssignments');
                } else {
                    tasksData = await callApi('farmData', { action: 'getTasks', farmId: '1' });
                    assignmentsData = await callApi('farmData', { action: 'getAssignments', farmId: '1' });
                }

                const tasksList = tasksData.tasks || [];
                const assignmentsList = assignmentsData?.assignments || [];
                setAssignments(assignmentsList);

                const tasksWithAssignments = tasksList.map((task: Task) => {
                    const taskAssignments = assignmentsList.filter((a: TaskAssignment) => a.taskId === task.id);
                    const activeAssignment = taskAssignments.find(a => !a.unassignedAt);
                    return {
                        ...task,
                        assignments: taskAssignments,
                        currentWorker: activeAssignment?.assignedTo,
                    };
                });

                setTasks(tasksWithAssignments);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleWorkerClick = (workerName: string, taskId: number) => {
        // Find all assignments for this task
        const taskAssignments = assignments.filter(a => a.taskId === taskId);
        const currentAssignment = taskAssignments.find(a => a.assignedTo === workerName);

        if (currentAssignment) {
            // Calculate days worked if unassigned
            let daysWorked = undefined;
            if (currentAssignment.unassignedAt) {
                const diffMs = currentAssignment.unassignedAt - currentAssignment.assignedAt;
                daysWorked = Math.round(diffMs / (1000 * 60 * 60 * 24));
            }

            // Mock additional worker info (in production, fetch from Firestore)
            const workerDetails: AssignmentWithDetails = {
                ...currentAssignment,
                workerName: currentAssignment.assignedTo,
                workerRole: getWorkerRole(currentAssignment.assignedTo),
                workerEmail: `${currentAssignment.assignedTo.toLowerCase().replace(/\s/g, '.')}@afrinuts.com`,
                workerPhone: `+225 ${Math.floor(Math.random() * 100000000)}`,
                daysWorked,
            };
            setSelectedAssignment(workerDetails);
            setShowModal(true);
        }
    };

    const getWorkerRole = (workerName: string): string => {
        // Mock role assignment - in production, fetch from user database
        if (workerName.includes('Manager') || workerName.includes('Supervisor')) return 'Farm Manager';
        if (workerName.includes('Lead')) return 'Team Lead';
        return 'Farm Worker';
    };

    const filteredTasks = tasks.filter(task => filter === 'ALL' ? true : task.status === filter);
    const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
    const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100/80 backdrop-blur-sm text-green-700 rounded-full text-xs font-medium border border-green-200/50">
                        <FaCheckCircle className="text-green-500" /> Completed
                    </span>
                );
            case 'IN_PROGRESS':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/80 backdrop-blur-sm text-blue-700 rounded-full text-xs font-medium border border-blue-200/50">
                        <FaPlay className="text-blue-500" /> In Progress
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100/80 backdrop-blur-sm text-yellow-700 rounded-full text-xs font-medium border border-yellow-200/50">
                        <FaClock className="text-yellow-500" /> Pending
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden pt-[72px]">
                <DashboardNavbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    const statCards = [
        { count: pendingCount, label: 'Pending Tasks', icon: FaClock, gradient: 'from-yellow-400/20 to-yellow-500/10', textColor: 'text-yellow-600', borderColor: 'border-yellow-300/30' },
        { count: inProgressCount, label: 'In Progress', icon: FaPlay, gradient: 'from-blue-400/20 to-blue-500/10', textColor: 'text-blue-600', borderColor: 'border-blue-300/30' },
        { count: completedCount, label: 'Completed', icon: FaCheckCircle, gradient: 'from-green-400/20 to-green-500/10', textColor: 'text-green-600', borderColor: 'border-green-300/30' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            {/* Hero Header */}
            <Section
                fullHeight={false}
                className="flex items-center justify-center text-center min-h-[40vh] relative"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            Task Management
                        </Typography>
                    </motion.div>

                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Tasks Overview
                    </motion.h1>

                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Track and monitor all farm operations including worker assignments and task history.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Development Mode Indicator */}
            {isDevelopment && (
                <div className="bg-yellow-100/80 backdrop-blur-sm border-b border-yellow-200">
                    <div className="container mx-auto px-4 py-2 text-center">
                        <span className="text-sm text-yellow-700">Development Mode - Using Mock Data</span>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative bg-gradient-to-br ${stat.gradient} border-2 ${stat.borderColor} rounded-2xl shadow-lg overflow-hidden transform-gpu`}
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -6,
                                scale: 1.03,
                                rotateY: 2,
                                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="relative z-10 p-6 text-center">
                                <motion.div
                                    className={`inline-flex p-3 rounded-full bg-white/40 backdrop-blur-md mb-3`}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <stat.icon className={`text-2xl ${stat.textColor}`} />
                                </motion.div>
                                <div className={`text-4xl font-bold ${stat.textColor} mb-1`}>{stat.count}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    className="flex flex-wrap gap-2 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map(tab => (
                        <motion.button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                                filter === tab
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                            }`}
                            whileHover={{ y: -2, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {tab === 'ALL' ? 'All Tasks' : tab.charAt(0) + tab.slice(1).toLowerCase().replace('_', ' ')}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Tasks List */}
                <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {filteredTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            variants={fadeIn}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-gradient-to-br from-white to-gray-50/80 border-2 border-gray-100 hover:border-primary/30 rounded-2xl shadow-md overflow-hidden transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -4,
                                scale: 1.01,
                                boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.15)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                            <div className="relative z-10 p-5">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                                            {getStatusBadge(task.status)}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                                        <div className="flex flex-wrap gap-3 text-xs">
                                            <span className="inline-flex items-center gap-1.5 bg-gray-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                <FaUser className="text-primary" /> Block {task.blockId}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 bg-gray-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                <FaCalendarAlt className="text-primary" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                            {task.currentWorker && (
                                                <motion.button
                                                    onClick={() => handleWorkerClick(task.currentWorker!, task.id)}
                                                    className="inline-flex items-center gap-1.5 bg-primary/10 backdrop-blur-sm px-2.5 py-1 rounded-full hover:bg-primary/20 transition-all cursor-pointer"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaUserCheck className="text-primary" />
                                                    <span>{task.currentWorker}</span>
                                                </motion.button>
                                            )}
                                            {task.completedDate && (
                                                <span className="inline-flex items-center gap-1.5 bg-green-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-green-700">
                                                    <FaCheckCircle /> Completed: {new Date(task.completedDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

                                        {task.assignments && task.assignments.length > 1 && (
                                            <details className="mt-3">
                                                <summary className="text-xs text-gray-400 cursor-pointer hover:text-primary transition">
                                                    <FaHistory className="inline mr-1" /> Assignment History ({task.assignments.length} records)
                                                </summary>
                                                <div className="mt-2 space-y-1 pl-4 border-l-2 border-gray-200">
                                                    {task.assignments.map(assignment => (
                                                        <div key={assignment.id} className="text-xs text-gray-500">
                                                            <span className="font-medium">{assignment.assignedTo}</span>
                                                            {' '}assigned on {new Date(assignment.assignedAt).toLocaleDateString()}
                                                            {assignment.unassignedAt && (
                                                                <> → completed on {new Date(assignment.unassignedAt).toLocaleDateString()}</>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredTasks.length === 0 && (
                        <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="inline-flex p-4 rounded-full bg-gray-100/60 backdrop-blur-sm mb-4"
                                whileHover={{ scale: 1.1 }}
                            >
                                <FaTasks className="text-3xl text-gray-400" />
                            </motion.div>
                            <Typography variant="body" className="text-gray-400">No tasks found</Typography>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* End-of-page CTA */}
            <Section className="py-10">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{ transformStyle: 'preserve-3d' }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            rotateY: 3,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="relative z-10">
                            <motion.div variants={fadeIn}>
                                <Typography variant="h2" className="mb-6 text-primary">
                                    Manage Farm Operations
                                </Typography>
                                <Typography variant="body" className="mb-8 text-gray-700 max-w-3xl mx-auto">
                                    Return to the dashboard for a full overview of tree health, block status, and financial performance across the farm.
                                </Typography>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.button
                                        className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden"
                                        variants={fadeIn}
                                        onClick={() => navigate('/dashboard')}
                                        whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover/btn:translate-z-[-6px] transition-all duration-300" />
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover/btn:opacity-70 transition-opacity duration-300" />
                                        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />
                                        <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                            <FaTasks className="text-lg" />
                                            Back to Dashboard
                                        </span>
                                    </motion.button>
                                    <motion.button
                                        className="relative border-2 border-primary/50 text-primary hover:bg-white/20 px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden backdrop-blur-sm"
                                        variants={fadeIn}
                                        onClick={() => navigate('/dashboard/financials')}
                                        whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.2)' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                            <FaChartPie className="text-lg" />
                                            View Financials
                                        </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Assignment Detail Modal */}
            {showModal && selectedAssignment && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FaUserCircle className="text-3xl" />
                                    <div>
                                        <h3 className="font-bold text-lg">Worker Details</h3>
                                        <p className="text-sm opacity-90">Assignment Information</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="text-center mb-4">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FaUserCheck className="text-3xl text-primary" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">{selectedAssignment.assignedTo}</h4>
                                <p className="text-sm text-gray-500">{selectedAssignment.workerRole || 'Farm Worker'}</p>
                            </div>

                            <div className="space-y-3 border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <FaCalendarAlt className="text-primary w-4" />
                                    <span className="text-gray-600">Assigned:</span>
                                    <span className="text-gray-900">{new Date(selectedAssignment.assignedAt).toLocaleDateString()}</span>
                                </div>
                                {selectedAssignment.unassignedAt && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <FaCheckCircle className="text-green-500 w-4" />
                                        <span className="text-gray-600">Completed:</span>
                                        <span className="text-gray-900">{new Date(selectedAssignment.unassignedAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {selectedAssignment.daysWorked !== undefined && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <FaHistory className="text-accent w-4" />
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="text-gray-900">{selectedAssignment.daysWorked} days</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <FaUser className="text-primary w-4" />
                                    <span className="text-gray-600">Task ID:</span>
                                    <span className="text-gray-900">#{selectedAssignment.taskId}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 text-center">
                                    Click outside to close • Assignment tracked in real-time
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Tasks;