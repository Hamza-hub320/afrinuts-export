import React, { useEffect, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    FaCheckCircle,
    FaClock,
    FaPlay,
    FaCalendarAlt,
    FaUser,
    FaTasks,
    FaUserCheck,
    FaChartPie, FaUserCircle, FaUserClock, FaClipboardList, FaTimes
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { staggerContainer, fadeIn } from '@/utils/animations';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react';

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

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<TaskWithAssignments[]>([]);
    const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [selectedWorker, setSelectedWorker] = useState<{
        name: string;
        taskTitle: string;
        assignedAt: number;
        completedAt?: number;
        role?: string;
    } | null>(null);

    const getAssignmentDuration = (assignedAt: number, completedAt?: number): string => {
        if (!completedAt) return 'In progress';
        const days = Math.ceil((completedAt - assignedAt) / (1000 * 60 * 60 * 24));
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

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
                    const lastAssignment = taskAssignments.length > 0
                        ? taskAssignments.reduce((latest, a) =>
                            (a.assignedAt > latest.assignedAt) ? a : latest
                        )
                        : null;

                    return {
                        ...task,
                        assignments: taskAssignments,
                        currentWorker: activeAssignment?.assignedTo || lastAssignment?.assignedTo || undefined,
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

    const filteredTasks = tasks.filter(task => filter === 'ALL' ? true : task.status === filter);
    const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
    const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return FaCheckCircle;
            case 'IN_PROGRESS': return FaPlay;
            default: return FaClock;
        }
    };

    const getStatusVariant = (status: string): 'primary' | 'accent' | 'secondary' => {
        switch (status) {
            case 'COMPLETED': return 'secondary';
            case 'IN_PROGRESS': return 'accent';
            default: return 'primary';
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
        { count: pendingCount, label: 'Pending Tasks', icon: FaClock, variant: 'primary' as const },
        { count: inProgressCount, label: 'In Progress', icon: FaPlay, variant: 'accent' as const },
        { count: completedCount, label: 'Completed', icon: FaCheckCircle, variant: 'secondary' as const },
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
                            Track and monitor all farm operations across the entire farm.
                        </Typography>
                        <Typography
                            variant="small"
                            className="text-primary/70 max-w-3xl mx-auto mb-8 flex items-center justify-center gap-1.5"
                        >
                            <FaUserCheck className="text-primary" />
                            Click on a worker's name to view assignment details, duration, and history.
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

            {/* Dashboard Overview Intro */}
            <Section className="py-8">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center"
                    >
                        <motion.div variants={fadeIn}>
                            <Typography variant="h2" className="mb-4 text-primary">
                                Task Management at a Glance
                            </Typography>
                            <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto mb-8">
                                Monitor all farm operations in real time. Track pending assignments, review work in progress, and verify completed tasks across every block of our farm. Use the filters below to focus on what matters most.
                            </Typography>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {statCards.map((stat, index) => (
                        <motion.div key={index} variants={fadeIn} transition={{ delay: index * 0.1 }}>
                            <InfoCard
                                icon={stat.icon}
                                title={String(stat.count)}
                                subtitle={stat.label}
                                variant={stat.variant}
                                showInfoBadge={false}
                            />
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

                {/* Tasks List - Using InfoCard */}
                <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {filteredTasks.map((task, index) => (
                        <motion.div key={task.id} variants={fadeIn} transition={{ delay: index * 0.05 }}>
                            <InfoCard
                                icon={getStatusIcon(task.status)}
                                title={task.title}
                                subtitle={task.description}
                                variant={getStatusVariant(task.status)}
                                showInfoBadge={false}
                            >
                                <div className="flex flex-wrap gap-3 text-xs mt-2">
                                    {task.blockId != null && (
                                        <span className="inline-flex items-center gap-1.5 bg-gray-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            <FaUser className="text-primary" /> Block {task.blockId}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 bg-gray-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                        <FaCalendarAlt className="text-primary" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                    {task.currentWorker && (
                                        <motion.button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const activeAssignment = task.assignments?.find(a => a.assignedTo === task.currentWorker && !a.unassignedAt);
                                                const lastCompleted = task.assignments?.find(a => a.assignedTo === task.currentWorker && a.unassignedAt);
                                                setSelectedWorker({
                                                    name: task.currentWorker,
                                                    taskTitle: task.title,
                                                    assignedAt: activeAssignment?.assignedAt || lastCompleted?.assignedAt || 0,
                                                    completedAt: lastCompleted?.unassignedAt,
                                                    role: task.type || 'Farm Worker',
                                                });
                                            }}
                                            className="inline-flex items-center gap-1.5 bg-primary/10 backdrop-blur-sm px-2.5 py-1 rounded-full hover:bg-primary/20 transition-all duration-200 cursor-pointer group/worker"
                                            whileHover={{ scale: 1.05, y: -1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaUserCheck className="text-primary group-hover/worker:text-accent transition-colors" />
                                            <span className="group-hover/worker:text-primary transition-colors">{task.currentWorker}</span>
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
                                            Assignment History ({task.assignments.length} records)
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
                            </InfoCard>
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
                            y: -8, scale: 1.02, rotateY: 3,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

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
                                        <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                            <FaTasks /> Back to Dashboard
                                        </span>
                                    </motion.button>
                                    <motion.button
                                        className="relative border-2 border-primary/50 text-primary hover:bg-white/20 px-8 py-4 rounded-full transform-gpu backdrop-blur-sm"
                                        variants={fadeIn}
                                        onClick={() => navigate('/dashboard/financials')}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                            <FaChartPie /> View Financials
                                        </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Worker Assignment Modal */}
                <Transition.Root show={!!selectedWorker} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setSelectedWorker(null)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel
                                        className="relative w-full max-w-md transform overflow-hidden rounded-2xl text-left shadow-xl backdrop-blur-lg transition-all duration-500"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.85) 100%)',
                                            border: '1px solid rgba(255,255,255,0.5)',
                                            boxShadow: '0 8px 32px rgba(165, 105, 66, 0.2), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-3xl animate-pulse"
                                             style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }} />
                                        <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full opacity-8 blur-3xl"
                                             style={{ background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite' }} />

                                        <div className="relative z-10 p-6">
                                            {selectedWorker && (
                                                <>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-primary/10 p-3 rounded-full">
                                                                <FaUserCircle className="text-primary text-2xl" />
                                                            </div>
                                                            <div>
                                                                <Dialog.Title as="h3" className="text-lg font-semibold text-primary">
                                                                    {selectedWorker.name}
                                                                </Dialog.Title>
                                                                <p className="text-sm text-gray-500">{selectedWorker.role}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setSelectedWorker(null)} className="text-gray-400 hover:text-gray-600">
                                                            <FaTimes className="h-5 w-5" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3 mt-4">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FaClipboardList className="text-primary" />
                                                            <span className="text-gray-600">Task:</span>
                                                            <span className="font-medium text-gray-900">{selectedWorker.taskTitle}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FaCalendarAlt className="text-primary" />
                                                            <span className="text-gray-600">Assigned:</span>
                                                            <span className="font-medium text-gray-900">{new Date(selectedWorker.assignedAt).toLocaleDateString()}</span>
                                                        </div>
                                                        {selectedWorker.completedAt && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <FaCheckCircle className="text-green-500" />
                                                                <span className="text-gray-600">Completed:</span>
                                                                <span className="font-medium text-gray-900">{new Date(selectedWorker.completedAt).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FaUserClock className="text-primary" />
                                                            <span className="text-gray-600">Duration:</span>
                                                            <span className="font-medium text-gray-900">{getAssignmentDuration(selectedWorker.assignedAt, selectedWorker.completedAt)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex justify-end">
                                                        <motion.button
                                                            onClick={() => setSelectedWorker(null)}
                                                            className="bg-primary hover:bg-dark-orange text-white px-4 py-2 rounded-lg text-sm"
                                                            whileHover={{ y: -1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Close
                                                        </motion.button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </Section>
        </div>
    );
};

export default Tasks;