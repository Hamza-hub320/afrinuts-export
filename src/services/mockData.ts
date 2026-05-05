// src/services/mockData.ts

export const mockFarmStats = {
    success: true,
    farm: {
        id: 1,
        name: "AfriNuts Odienné",
        location: "Odienné, Côte d'Ivoire",
        totalHectares: 35,
        cashewHectares: 35,
        treesPerHectare: 100,
        plantingYear: 2024,
    },
    stats: {
        totalBlocks: 35,
        plantedBlocks: 18,
        totalTrees: 3500,
        aliveTrees: 3120,
        survivalRate: 89.1,
    },
};

export const mockBlocks = Array.from({ length: 35 }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / 7)); // A-E
    const col = (i % 7) + 1;
    // More realistic distribution based on actual farm progress
    let status;
    if (i < 5) status = 'PLANTED';
    else if (i < 10) status = 'PLOWED';
    else if (i < 15) status = 'CLEARED';
    else status = 'NOT_CLEARED';

    // Randomize some statuses for realism
    if (i === 7) status = 'PLANTED';
    if (i === 12) status = 'PLANTED';
    if (i === 18) status = 'PLOWED';

    return {
        id: i + 1,
        blockName: `${row}${col}`,
        hectareSize: 1.0,
        status: status,
        survivalRate: status === 'PLANTED' ? 85 + Math.random() * 10 : 0,
        clearedDate: status !== 'NOT_CLEARED' ? Date.now() - Math.random() * 30 * 86400000 : null,
        plowedDate: status === 'PLOWED' || status === 'PLANTED' ? Date.now() - Math.random() * 20 * 86400000 : null,
        plantedDate: status === 'PLANTED' ? Date.now() - Math.random() * 10 * 86400000 : null,
    };
});

export const mockTasks = [
    {
        id: 1,
        title: "Clear Block A1",
        description: "Clear land for planting cashew trees",
        status: "COMPLETED",
        type: "CLEARING",
        dueDate: Date.now() - 5 * 86400000,
        completedDate: Date.now() - 6 * 86400000,
        blockId: 1,
    },
    {
        id: 2,
        title: "Plow Block A2",
        description: "Plow soil for planting",
        status: "COMPLETED",
        type: "PLOWING",
        dueDate: Date.now() - 3 * 86400000,
        completedDate: Date.now() - 4 * 86400000,
        blockId: 2,
    },
    {
        id: 3,
        title: "Plant Block A3",
        description: "Plant cashew seedlings",
        status: "COMPLETED",
        type: "PLANTING",
        dueDate: Date.now() - 2 * 86400000,
        completedDate: Date.now() - 3 * 86400000,
        blockId: 3,
    },
    {
        id: 4,
        title: "Fertilize Block B2",
        description: "Apply organic fertilizer",
        status: "IN_PROGRESS",
        type: "FERTILIZING",
        dueDate: Date.now() + 2 * 86400000,
        blockId: 9,
    },
    {
        id: 5,
        title: "Weed Block C4",
        description: "Remove weeds from block",
        status: "PENDING",
        type: "WEEDING",
        dueDate: Date.now() + 5 * 86400000,
        blockId: 18,
    },
    {
        id: 6,
        title: "Irrigate Block D1",
        description: "Set up irrigation system",
        status: "PENDING",
        type: "IRRIGATION",
        dueDate: Date.now() + 7 * 86400000,
        blockId: 22,
    },
    {
        id: 7,
        title: "Prune Block E5",
        description: "Prune trees for better growth",
        status: "PENDING",
        type: "PRUNING",
        dueDate: Date.now() + 10 * 86400000,
        blockId: 33,
    },
];

export const mockAssignments = [
    {
        id: 10,
        taskId: 1,
        assignedTo: "John Worker",
        assignedAt: Date.now() - 15 * 86400000,
        unassignedAt: Date.now() - 10 * 86400000,
    },
    {
        id: 11,
        taskId: 1,
        assignedTo: "Jane Manager",
        assignedAt: Date.now() - 8 * 86400000,
        unassignedAt: null, // Still assigned
    },
    {
        id: 12,
        taskId: 2,
        assignedTo: "Peter Team",
        assignedAt: Date.now() - 12 * 86400000,
        unassignedAt: Date.now() - 5 * 86400000,
    },
    {
        id: 13,
        taskId: 3,
        assignedTo: "Mary Foreman",
        assignedAt: Date.now() - 20 * 86400000,
        unassignedAt: Date.now() - 18 * 86400000,
    },
];


export const mockRevenues = [
    { id: 1, totalAmount: 5250000, harvestDate: Date.now() - 15 * 86400000, quality: "PREMIUM" },
    { id: 2, totalAmount: 3120000, harvestDate: Date.now() - 30 * 86400000, quality: "STANDARD" },
    { id: 3, totalAmount: 2870000, harvestDate: Date.now() - 45 * 86400000, quality: "PREMIUM" },
    { id: 4, totalAmount: 1980000, harvestDate: Date.now() - 60 * 86400000, quality: "PROCESSING" },
];

export const mockExpenses = [
    { id: 1, amount: 1250000, date: Date.now() - 10 * 86400000, category: "LABOR" },
    { id: 2, amount: 850000, date: Date.now() - 20 * 86400000, category: "FERTILIZER" },
    { id: 3, amount: 450000, date: Date.now() - 35 * 86400000, category: "EQUIPMENT" },
    { id: 4, amount: 320000, date: Date.now() - 50 * 86400000, category: "IRRIGATION" },
    { id: 5, amount: 280000, date: Date.now() - 65 * 86400000, category: "MAINTENANCE" },
];

export const getMockData = async (action: string, data?: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (action) {
        case 'getFarmSummary':
        case 'getPublicFarmStats':
            return mockFarmStats;
        case 'getBlocks':
            return { success: true, blocks: mockBlocks };
        case 'getTasks':
            return { success: true, tasks: mockTasks };
        case 'getRevenueSummary':
            return { success: true, revenues: mockRevenues, totalRevenue: mockRevenues.reduce((s, r) => s + r.totalAmount, 0) };
        case 'getExpenseSummary':
            return { success: true, expenses: mockExpenses, totalExpenses: mockExpenses.reduce((s, e) => s + e.amount, 0) };
        default:
            return { success: false, error: 'Unknown action' };
        case 'getAssignments':
            return Promise.resolve({ success: true, assignments: mockAssignments });
    }
};