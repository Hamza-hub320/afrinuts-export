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

// Add these mock data objects alongside your existing ones (after mockExpenses)

export const mockSuppliers = [
    {
        id: 4,
        name: 'AgroCoop Odienné',
        type: 'COOPERATIVE',
        status: 'ACTIVE',
        location: 'Odienné, Côte d\'Ivoire',
        region: 'Denguélé',
        country: 'Côte d\'Ivoire',
        contactPerson: 'Kouadio Jean',
        phone: '+225 07 12 34 567',
        email: 'contact@agrocoop.ci',
        registrationNumber: 'COOP-2026-00001',
        taxId: '',
        annualVolumeKg: 150000,
        averageQualityScore: 24.08,
        rating: 3,
        farmSize: 0,
        yearsFarming: 0,
        isCertified: false,
        certificationType: '',
        certificationNumber: '',
        certificationExpiryDate: 0,
        hasLocation: false,
        latitude: 0,
        longitude: 0,
        firebreakProtection: false,
        noChildLabor: false,
        sustainableHarvesting: false,
        isActive: true,
        notes: 'First supplier of the season',
        photoUrl: null,
        bio: 'Leading cooperative in the region.',
        quote: '',
    },
    {
        id: 5,
        name: 'Farmers United',
        type: 'INDEPENDENT_FARMER',
        status: 'ACTIVE',
        location: 'Korhogo, Côte d\'Ivoire',
        region: 'Poro',
        country: 'Côte d\'Ivoire',
        contactPerson: 'Mariam Traoré',
        phone: '+225 05 98 76 543',
        email: 'mariam@farmersunited.ci',
        registrationNumber: 'FARM-2026-00003',
        taxId: '',
        annualVolumeKg: 80000,
        averageQualityScore: 50.5,
        rating: 3,
        farmSize: 35,
        yearsFarming: 14,
        isCertified: false,
        certificationType: '',
        certificationNumber: '',
        certificationExpiryDate: 0,
        hasLocation: false,
        latitude: 0,
        longitude: 0,
        firebreakProtection: true,
        noChildLabor: true,
        sustainableHarvesting: true,
        isActive: true,
        notes: 'High quality organic cashew supplier',
        photoUrl: null,
        bio: 'Mariam Traoré is an independent farmer from Korhogo with 14 years of cashew farming experience.',
        quote: 'We Win Together',
    },
    {
        id: 7,
        name: 'WeSupOrg',
        type: 'REGIONAL_SUPPLIER',
        status: 'ACTIVE',
        location: 'GPS: 37.421998, -122.084000',
        region: null,
        country: 'Côte d\'Ivoire',
        contactPerson: 'Hamza Sangare',
        phone: '0000000000',
        email: 'hamza@afrinutsexport.com',
        registrationNumber: 'SUPP-2026-00002',
        taxId: null,
        annualVolumeKg: 80000,
        averageQualityScore: 50.5,
        rating: 3,
        farmSize: 35,
        yearsFarming: 14,
        isCertified: false,
        certificationType: null,
        certificationNumber: null,
        certificationExpiryDate: 0,
        hasLocation: true,
        latitude: 37.421998,
        longitude: -122.084,
        firebreakProtection: true,
        noChildLabor: true,
        sustainableHarvesting: true,
        isActive: true,
        notes: 'This is a test',
        photoUrl: null,
        bio: 'My bio Test',
        quote: 'We Grow Together',
    },
];

export const mockQualityBatches = [
    {
        id: 3,
        batchNumber: 'AFN-INDP-ORG-260626-008',
        supplierId: 5,
        weightKg: 25000,
        qualityGrade: 'PREMIUM',
        qualityScore: 100,
        moistureContent: 5.8,
        defectiveRate: 1.8,
        kernelRatio: 97,
        nutCountPerKg: 178,
        processingDate: 1773147591950,
        testResults: '{"aflatoxin":0.2,"heavyMetals":0.1,"pesticideResidue":0.1}',
        sustainableHarvesting: true,
        firebreakProtection: true,
        noChildLabor: true,
        farmOsMonitored: false,
        verifiedAt: 1773147591950,
        notes: 'High quality organic cashews from independent farmer',
        sourceType: 'INDEPENDENT',
        blockId: null,
        harvestCycleId: null,
    },
    {
        id: 4,
        batchNumber: 'AFN-INDP-CONV-260626-011',
        supplierId: 4,
        weightKg: 30000,
        qualityGrade: 'STANDARD',
        qualityScore: 97.25,
        moistureContent: 6.8,
        defectiveRate: 5.5,
        kernelRatio: 88,
        nutCountPerKg: 195,
        processingDate: 1772715657539,
        testResults: '{"aflatoxin":0.8,"heavyMetals":0.3,"pesticideResidue":1.5}',
        sustainableHarvesting: false,
        firebreakProtection: false,
        noChildLabor: false,
        farmOsMonitored: false,
        verifiedAt: 0,
        notes: 'Late season delivery - acceptable quality',
        sourceType: 'INDEPENDENT',
        blockId: null,
        harvestCycleId: null,
    },
    {
        id: 8,
        batchNumber: 'AFN-INDP-ORG-260628-006',
        supplierId: 7,
        weightKg: 10000,
        qualityGrade: 'PREMIUM',
        qualityScore: 98.35,
        moistureContent: 3.2,
        defectiveRate: 2.1,
        kernelRatio: 88,
        nutCountPerKg: 190,
        processingDate: 1782657651840,
        testResults: '{"aflatoxin":0.2,"heavyMetals":0.1,"pesticideResidue":0.1}',
        sustainableHarvesting: true,
        firebreakProtection: true,
        noChildLabor: true,
        farmOsMonitored: true,
        verifiedAt: 1782657676516,
        notes: 'test',
        sourceType: 'INDEPENDENT',
        blockId: null,
        harvestCycleId: null,
    },
];

export const mockSupplierExpenses = [
    {
        id: 17,
        amount: 400000,
        date: 1783255540555,
        category: 'PROCUREMENT',
        supplierId: 5,
        supplierName: 'Farmers United',
        batchId: 3,
        batchNumber: 'AFN-INDP-ORG-260626-008',
        description: 'Procurement for organic batch',
    },
    {
        id: 15,
        amount: 2000000,
        date: 1782549652691,
        category: 'PROCUREMENT',
        supplierId: 4,
        supplierName: 'AgroCoop Odienné',
        batchId: 2,
        batchNumber: 'AFN-COOP-CONV-260626-005',
        description: 'Procurement from AgroCoop',
    },
    {
        id: 16,
        amount: 2500000,
        date: 1782630750847,
        category: 'PROCUREMENT',
        supplierId: 7,
        supplierName: 'WeSupOrg',
        batchId: 5,
        batchNumber: 'AFN-INDP-CONV-260628-003',
        description: 'Cashew procurement from suppliers',
    },
];

export const mockSupplierRevenues = [
    {
        id: 43,
        totalAmount: 67200000,
        quality: 'PREMIUM',
        supplierId: 5,
        supplierName: 'Farmers United',
        batchId: 3,
        batchNumber: 'AFN-INDP-ORG-260626-008',
        buyer: 'AFEX Commodities',
        harvestDate: 1773564046249,
        quantityKg: 24000,
        pricePerKg: 2800,
    },
    {
        id: 42,
        totalAmount: 61200000,
        quality: 'STANDARD',
        supplierId: 4,
        supplierName: 'AgroCoop Odienné',
        batchId: 2,
        batchNumber: 'AFN-COOP-CONV-260626-005',
        buyer: 'Cargill',
        harvestDate: 1777102742859,
        quantityKg: 34000,
        pricePerKg: 1800,
    },
    {
        id: 44,
        totalAmount: 253294800000,
        quality: 'PREMIUM',
        supplierId: 7,
        supplierName: 'WeSupOrg',
        batchId: 5,
        batchNumber: 'AFN-INDP-CONV-260628-003',
        buyer: 'Olam',
        harvestDate: 1782630866596,
        quantityKg: 80000,
        pricePerKg: 3166185,
    },
];

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
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (action) {
        case 'getFarmSummary':
            return mockFarmStats;
        case 'getPublicFarmStats':
            return {
                ...mockFarmStats,
                blockStatusDistribution: [
                    { name: 'PLANTED', value: 8 },
                    { name: 'PLOWED', value: 5 },
                    { name: 'CLEARED', value: 7 },
                    { name: 'NOT_CLEARED', value: 15 },
                ],
            };
        case 'getBlocks':
            return { success: true, blocks: mockBlocks };
        case 'getTasks':
            return { success: true, tasks: mockTasks };
        case 'getAssignments':
            return { success: true, assignments: mockAssignments };
        case 'getRevenueSummary':
            return { success: true, revenues: mockRevenues, totalRevenue: mockRevenues.reduce((s, r) => s + r.totalAmount, 0) };
        case 'getExpenseSummary':
            return { success: true, expenses: mockExpenses, totalExpenses: mockExpenses.reduce((s, e) => s + e.amount, 0) };

        // ✅ ADD SUPPLIER CASES
        case 'getSuppliers':
            return { suppliers: mockSuppliers };

        case 'getSupplierQualityBatches': {
            const supplierId = data?.supplierId ? parseInt(data.supplierId) : null;
            const filtered = supplierId
                ? mockQualityBatches.filter(b => b.supplierId === supplierId)
                : mockQualityBatches;
            return { batches: filtered };
        }

        case 'getSupplierFinancials': {
            const supplierId = data?.supplierId ? parseInt(data.supplierId) : null;
            const filteredExpenses = supplierId
                ? mockSupplierExpenses.filter(e => e.supplierId === supplierId)
                : mockSupplierExpenses;
            const filteredRevenues = supplierId
                ? mockSupplierRevenues.filter(r => r.supplierId === supplierId)
                : mockSupplierRevenues;
            return {
                expenses: filteredExpenses,
                revenues: filteredRevenues,
                totalProcurement: filteredExpenses.reduce((s, e) => s + e.amount, 0),
                totalRevenue: filteredRevenues.reduce((s, r) => s + r.totalAmount, 0),
            };
        }

        default:
            return { success: false, error: 'Unknown action' };
    }
};