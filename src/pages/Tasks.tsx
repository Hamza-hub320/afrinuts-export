import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaPlay, FaPlus, FaCalendarAlt, FaUser, FaTasks, FaSpinner } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { staggerContainer, fadeIn } from '@/utils/animations';

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

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                let data;
                if (isDevelopment) {
                    data = await getMockData('getTasks');
                } else {
                    data = await callApi('farmData', { action: 'getTasks', farmId: '1' });
                }
                setTasks(data.tasks || []);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

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
            <div className="flex justify-center items-center min-h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="flex flex-col items-center gap-4"
                >
                    <FaSpinner className="text-4xl text-primary" />
                    <Typography variant="body" className="text-text-dark">Loading tasks...</Typography>
                </motion.div>
            </div>
        );
    }

    const statCards = [
        { count: pendingCount, label: 'Pending Tasks', icon: FaClock, gradient: 'from-yellow-400/20 to-yellow-500/10', textColor: 'text-yellow-600', borderColor: 'border-yellow-300/30' },
        { count: inProgressCount, label: 'In Progress', icon: FaPlay, gradient: 'from-blue-400/20 to-blue-500/10', textColor: 'text-blue-600', borderColor: 'border-blue-300/30' },
        { count: completedCount, label: 'Completed', icon: FaCheckCircle, gradient: 'from-green-400/20 to-green-500/10', textColor: 'text-green-600', borderColor: 'border-green-300/30' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                className="flex justify-between items-center mb-8 flex-wrap gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        className="bg-primary/10 backdrop-blur-sm p-3 rounded-full"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <FaTasks className="text-primary text-2xl" />
                    </motion.div>
                    <Typography variant="h2" className="text-primary">Tasks Management</Typography>
                </div>
                <motion.button
                    className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-medium shadow-md transform-gpu overflow-hidden group/btn"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover/btn:translate-z-[-6px] transition-all duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                    <FaPlus className="relative z-10" />
                    <span className="relative z-10">Create New Task</span>
                </motion.button>
            </motion.div>

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
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)] transition-shadow duration-500" />
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
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-500" />

                        <div className="relative z-10 p-5">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                                        {getStatusBadge(task.status)}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                        <span className="inline-flex items-center gap-1.5 bg-gray-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            <FaUser className="text-primary" /> Block {task.blockId}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-gray-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            <FaCalendarAlt className="text-primary" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                        {task.completedDate && (
                                            <span className="inline-flex items-center gap-1.5 bg-green-100/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-green-700">
                                                <FaCheckCircle /> Completed: {new Date(task.completedDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        className="px-4 py-2 text-sm border border-primary/50 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 backdrop-blur-sm"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Update Status
                                    </motion.button>
                                    <motion.button
                                        className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-300 backdrop-blur-sm"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Assign Worker
                                    </motion.button>
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
    );
};

export default Tasks;