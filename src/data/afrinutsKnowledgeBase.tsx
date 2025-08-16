export interface ProcessingStage {
    name: string;
    description: string;
    purpose: string;
    equipment: string;
    methods?: string[];
    yield?: string;
    parameters?: string;
    importance?: string;
    qualityControl?: string;
    standards?: string[];
}

export interface ProcessingByproduct {
    name: string;
    composition?: string;
    applications?: string[];
    marketValue?: string;
    use?: string;
    disposal?: string;
}

export interface QualityParameter {
    parameter: string;
    standard: string;
    testMethod?: string;
    importance?: string;
    tolerance?: string;
    control?: string;
}

export interface PricingData {
    current: {
        rawCashewDomestic: number;
        rawCashewExport: number;
        W320Kernels: number;
        SWKernels: number;
        CNSL: number;
        lastUpdated: string;
    };
    historical: Array<{
        date: string;
        rawCashewDomestic: number;
        W320Kernels: number;
    }>;
    sources: string[];
}

export interface FAQItem {
    question: string;
    answer: string;
    keywords: string[];
}

export interface KnowledgeBase {
    companyOverview: {
        name: string;
        founded: number;
        location: {
            headquarters: string;
            operationalBase: string;
            country: string;
            significance: string;
        };
        ownership: string;
        mission: string;
        vision: string;
        coreValues: Array<{
            name: string;
            description: string;
        }>;
        competitiveAdvantages: string[];
    };
    businessModel: {
        phases: Array<{
            name: string;
            description: string;
            activities: string[];
            keyMetrics: string[];
        }>;
        revenueStreams: {
            current: {
                name: string;
                markets: string[];
                projection: string;
            };
            future: Array<{
                name: string;
                items: Array<{
                    name: string;
                    targetMarkets?: string[];
                    uniqueValue?: string;
                    certification?: string;
                }>;
            }>;
        };
    };
    operations: {
        farming: {
            techniques: string[];
            sustainability: string[];
            timeline: Record<string, string>;
        };
        processing: {
            features: string[];
            certifications: Array<{
                name: string;
                target: number;
                purpose?: string;
                certifyingBodies?: string[];
            }>;
        };
        logistics: {
            partners: string[];
            targetMarkets: string[];
        };
    };
    financials: {
        investment: {
            seeking: string;
            allocation: Array<{
                category: string;
                amount: string;
                use: string;
            }>;
            profitDistribution: string[];
        };
        projections: {
            tradingPhase: Record<string, string>;
            processingPhase: Record<string, string> & { margin: string };
        };
    };
    farmerRelations: {
        dependencyStrategy: Array<{
            pillar: string;
            method: string;
            impact: string;
        }>;
        communityPrograms: string[];
    };
    riskManagement: {
        keyRisks: Array<{
            category: string;
            item: string;
            mitigation: string;
        }>;
        contingencyPlans: string[];
    };
    foundation: {
        principle: string;
        quranicBasis: Array<{
            verse: string;
            text: string;
        }>;
        hadithBasis: Array<{
            source: string;
            text: string;
        }>;
        dimensions: Array<{
            name: string;
            practice: string;
        }>;
    };
    leadershipStructure: {
        executiveTeam: Array<{
            position: string;
            name: string;
            responsibilities: string[];
            islamicPrinciple: string;
        }>;
        divisionalLeadership: Array<{
            division: string;
            head: string;
            islamicPractices?: string[];
            keyMetrics?: string[];
            qualityStandards?: string[];
            programs?: string[];
            quranicBasis?: string;
        }>;
    };
    decisionMaking: {
        strategicBoard: {
            composition: string[];
            responsibilities: string[];
            meetingFrequency: string;
        };
        executiveCommittee: {
            members: string[];
            process: string[];
            islamicPrinciple: string;
        };
        emergencyProtocols: {
            thresholds: Array<{
                type: string;
                threshold: string;
                action: string;
            }>;
        };
    };
    complianceMechanisms: {
        financialTransparency: Array<{
            tool: string;
            features: string[];
            access: string[];
        }>;
        islamicAudits: Array<{
            type: string;
            frequency?: string;
            checks?: string[];
            methods?: string[];
        }>;
        reporting: Array<{
            audience: string;
            frequency: string;
            contents?: string[];
            format?: string[];
        }>;
    };
    ethicalPolicies: {
        financial: Array<{
            policy: string;
            implementation: string[];
        }>;
        employment: Array<{
            policy: string;
            standards: string[];
        }>;
        sourcing: Array<{
            policy: string;
            requirements: string[];
        }>;
    };
    processingTerminology: {
        stages: ProcessingStage[];
        byproducts: ProcessingByproduct[];
        qualityParameters: QualityParameter[];
    };
    pricingData: PricingData;
    certifications: {
        roadmap: Array<{
            name: string;
            timeline: string;
            body?: string;
            cost?: string;
            requirements?: string[];
            focus?: string;
        }>;
        preparation: {
            documentation: string[];
            training: string[];
        };
    };
    faqs: Record<string, FAQItem[]>;
    questionVariations: Record<string, string[]>;
    followUps: Record<string, string>;
    contact: {
        headquarters: string;
        management: string[];
        investorRelations: string;
        certificationsContact: string;
    };
}

export const afrinutsKnowledgeBase = {
    companyOverview: {
        name: "AfriNuts Export",
        founded: 2023,
        location: {
            headquarters: "Odienné",
            operationalBase: "Abidjan",
            country: "Côte d'Ivoire/Ivory Coast",
            significance: "Heart of Ivory Coast's cashew belt (produces 20% of global supply)", 
            region: undefined,
            city: undefined

        },
        ownership: "50-hectare family-owned farm (35ha for cashews, 15ha for infrastructure)",
        mission: "To modernize the cashew sector through ethical sourcing, sustainable farming, and value-added processing while empowering Muslim communities.",
        vision: "Become a global leader in halal-certified cashew products by 2031, recognized for quality, equity, and faith-aligned business practices.",
        coreValues: [
            {
                name: "Quality",
                description: "Strict quality control from farm to table with premium cashew products"
            },
            {
                name: "Sustainability",
                description: "Organic practices, water-efficient irrigation, and zero-waste goals"
            },
            {
                name: "Community Empowerment",
                description: "10% of profits to local Muslim communities (mosques, madrassas, wells)"
            },
            {
                name: "Islamic Ethics",
                description: "Halal compliance, riba-free financing, and zakat distribution"
            }
        ],
        competitiveAdvantages: [
            "Family land with unrestricted development rights",
            "Governor of Odienné as key advisor",
            "20+ years family experience in cashew trade",
            "Vertical integration from farming to processing"
        ]
    },
    businessModel: {
        phases: [
            {
                name: "Phase 1: Raw Cashew Trading (2026-2031)",
                description: "Building domestic network and supply chain relationships",
                activities: [
                    "Sourcing from local farmers with quality incentives",
                    "Trading 90 tons annually in domestic market",
                    "Building storage/logistics infrastructure"
                ],
                keyMetrics: [
                    "$600/ton purchase price → $930/ton resale",
                    "62.69% ROI in first 2 years",
                    "100% profit reinvestment"
                ]
            },
            {
                name: "Phase 2: Cashew Farm (2026-2031)",
                description: "Developing 50-hectare plantation with first harvest in 2031",
                activities: [
                    "4m×4m spacing (100 trees/ha)",
                    "Grafted seedlings at $0.40/kg",
                    "Sustainable farming practices"
                ],
                keyMetrics: [
                    "First harvest: 2031",
                    "35 hectares dedicated to cashews",
                    "$11,915 initial planting budget"
                ]
            },
            {
                name: "Phase 3: Processing Center (2027-2031)",
                description: "Halal-certified facility for value-added products",
                activities: [
                    "Kernels (30% yield at $6,500/ton)",
                    "CNSL byproduct ($450/ton)",
                    "Cashew butter/milk production"
                ],
                keyMetrics: [
                    "150+ local jobs created",
                    "50% gross margin on processed goods",
                    "Zero-waste production model"
                ]
            }
        ],
        revenueStreams: {
            current: {
                name: "Raw Cashew Trading",
                markets: ["Domestic Ivory Coast", "Regional ECOWAS"],
                projection: "$251,435 revenue by 2031 (24.6% CAGR)"
            },
            future: [
                {
                    name: "Processed Products (2031+)",
                    items: [
                        {
                            name: "Roasted Cashews",
                            targetMarkets: ["EU", "North America"]
                        },
                        {
                            name: "Cashew Butter",
                            uniqueValue: "Plant-based protein market"
                        },
                        {
                            name: "Cashew Milk",
                            certification: "Targeting Organic & Fair Trade"
                        }
                    ]
                }
            ]
        }
    },
    operations: {
        farming: {
            techniques: [
                "Drone monitoring",
                "AI-powered soil sensors",
                "Drought-resistant varieties"
            ],
            sustainability: [
                "Buffer zones from non-organic fields",
                "Legume cover crops",
                "Composting system"
            ],
            timeline: {
                "2026": "Land clearing and planting",
                "2027": "Nursery development",
                "2031": "First commercial harvest"
            }
        },
        processing: {
            features: [
                "Solar-powered facility",
                "Automated shelling/grading",
                "Blockchain traceability"
            ],
            certifications: [
                {
                    name: "ISO 22000",
                    target: 2027,
                    purpose: "Food safety management"
                },
                {
                    name: "Halal",
                    target: 2028,
                    certifyingBodies: ["IVAC", "GIMDES"]
                }
            ]
        },
        logistics: {
            partners: [
                "ECOWAS-approved transporters",
                "3PL providers for international exports"
            ],
            targetMarkets: [
                "Europe (35% global imports)",
                "North America (health food sector)",
                "Gulf countries (halal market)"
            ]
        }
    },
    financials: {
        investment: {
            seeking: "$200,000 for 25% equity",
            allocation: [
                {
                    category: "Trading Operations",
                    amount: "$120,000",
                    use: "90 tons raw cashew procurement"
                },
                {
                    category: "Farm Development",
                    amount: "$60,000",
                    use: "Land prep, fencing, seedlings"
                },
                {
                    category: "Storage Facility",
                    amount: "$20,000",
                    use: "Strategic logistics hub"
                }
            ],
            profitDistribution: [
                "25% to investors (starting 2031)",
                "25% company reinvestment",
                "40% founding team",
                "10% Islamic Social Responsibility"
            ]
        },
        projections: {
            tradingPhase: {
                "2026": "$83,700 revenue",
                "2031": "$251,435 revenue"
            },
            processingPhase: {
                "2031": "$203,850 revenue",
                "2036": "$883,350 revenue",
                margin: "50% gross margin"
            }
        }
    },
    farmerRelations: {
        dependencyStrategy: [
            {
                pillar: "Fair Pricing",
                method: "Government-set price guarantees",
                impact: "Stabilizes farmer income despite market fluctuations"
            },
            {
                pillar: "Resources & Training",
                method: "Subsidized inputs + modern farming techniques",
                impact: "Increases yields by 30-40%"
            },
            {
                pillar: "Financing",
                method: "Microloans against future sales",
                impact: "Provides working capital during growing season"
            },
            {
                pillar: "Long-term Contracts",
                method: "Exclusive purchase agreements",
                impact: "Guaranteed market access for farmers"
            }
        ],
        communityPrograms: [
            "Construction of masajid",
            "Madrassa education programs",
            "Clean water well projects"
        ]
    },
    riskManagement: {
        keyRisks: [
            {
                category: "Market",
                item: "Price volatility ($300-$600/ton CNSL range)",
                mitigation: "Hedging strategies + forward contracts"
            },
            {
                category: "Operational",
                item: "Processing center delays",
                mitigation: "Penalty clauses in construction contracts"
            },
            {
                category: "Environmental",
                item: "Climate change",
                mitigation: "Drought-resistant varieties + irrigation"
            }
        ],
        contingencyPlans: [
            "15% budget reserve",
            "Alternative supplier network",
            "Multi-currency accounts"
        ]
    },
    foundation: {
        principle: "Amanah (Divine Trust)",
        quranicBasis: [
            {
                verse: "4:58",
                text: "Indeed, Allah commands you to render trusts to whom they are due"
            },
            {
                verse: "2:188",
                text: "Do not consume wealth unjustly or use it to bribe officials"
            }
        ],
        hadithBasis: [
            {
                source: "Bukhari & Muslim (Hadith on Responsibility)",
                text: "The Messenger of Allah ﷺ said: 'Each of you is a shepherd and each of you will be asked about his flock.'"
            }
        ],
        dimensions: [
            {
                name: "Divine Accountability",
                practice: "Halal operations and ethical resource stewardship"
            },
            {
                name: "Social Responsibility",
                practice: "Fair wages and farmer development programs"
            },
            {
                name: "Investor Transparency",
                practice: "Sharia-compliant profit distribution"
            },
            {
                name: "Environmental Stewardship",
                practice: "Biodiversity protection and sustainable farming"
            }
        ]
    },
    leadershipStructure: {
        executiveTeam: [
            {
                position: "CEO",
                name: "Hamza Sangare SR.",
                responsibilities: [
                    "Strategic vision and investor relations",
                    "Islamic compliance oversight",
                    "Final approval on major contracts"
                ],
                islamicPrinciple: "Shura (Consultation)"
            },
            {
                position: "CFO-COO",
                name: "Sekou Hakim",
                responsibilities: [
                    "Riba-free financial management",
                    "Profit distribution (Mudarabah model)",
                    "Operational coordination"
                ],
                islamicPrinciple: "Ihsan (Excellence in Resource Management)"
            },
            {
                position: "CCO",
                name: "Mohamadue A. Kouyaté",
                responsibilities: [
                    "Global halal export compliance",
                    "B2B contract negotiations",
                    "Marketing ethics oversight"
                ],
                islamicPrinciple: "Fulfillment of Covenants (Qur'an 5:1)"
            }
        ],
        divisionalLeadership: [
            {
                division: "Agricultural",
                head: "Souleymane Sangare",
                islamicPractices: [
                    "Moon-phase planting cycles",
                    "Tayyib (pure) soil management",
                    "Farmer tarbiyah (training) programs"
                ],
                keyMetrics: [
                    "Yield per hectare vs water usage",
                    "Farmer retention rates",
                    "Organic transition progress"
                ]
            },
            {
                division: "Processing",
                head: "Rouillard Cedric",
                islamicPractices: [
                    "Zero-waste production (Qur'an 7:31)",
                    "Halal-certified equipment",
                    "Worker dignity protocols"
                ],
                qualityStandards: [
                    "ISO 22000 food safety",
                    "No cross-contamination",
                    "Eco-friendly packaging"
                ]
            },
            {
                division: "Community Development",
                head: "Islamic Affairs Officer",
                islamicPractices: [],
                programs: [
                    "10% profit allocation to:",
                    "- Mosque/madrasah construction",
                    "- Clean water well projects",
                    "- Islamic microfinance"
                ],
                quranicBasis: "Qur'an 2:267 (Spending from good earnings)"
            }
        ]
    },
    decisionMaking: {
        strategicBoard: {
            composition: [
                "CEO",
                "Investor representatives (max 3)",
                "Independent Sharia Advisor"
            ],
            responsibilities: [
                "Annual zakat calculation/distribution (2.5% of liquid assets)",
                "ESG compliance audits",
                "Major investment approvals"
            ],
            meetingFrequency: "Quarterly"
        },
        executiveCommittee: {
            members: [
                "All C-level executives",
                "Division heads"
            ],
            process: [
                "Monthly rotation meetings (Farm→Finance→Export→Community)",
                "75% consensus required for major decisions",
                "Dispute resolution via Sharia Advisor"
            ],
            islamicPrinciple: "Ijma' (Consensus)"
        },
        emergencyProtocols: {
            thresholds: [
                {
                    type: "Financial",
                    threshold: ">15% budget variance",
                    action: "Immediate Shura council"
                },
                {
                    type: "Operational",
                    threshold: "Crop failure >30%",
                    action: "Activate contingency fund"
                }
            ]
        }
    },
    complianceMechanisms: {
        financialTransparency: [
            {
                tool: "Live Dashboard",
                features: [
                    "Real-time farm yield data",
                    "Profit distribution tracking",
                    "Zakat calculator"
                ],
                access: [
                    "Investors (partial)",
                    "Sharia Board (full)",
                    "Public (aggregate)"
                ]
            }
        ],
        islamicAudits: [
            {
                type: "Halal Process Audit",
                frequency: "Bi-annual",
                checks: [
                    "Supply chain riba-free verification",
                    "Worker payment timeliness",
                    "Environmental impact assessment"
                ]
            },
            {
                type: "Community Impact Review",
                methods: [
                    "Farmer satisfaction surveys",
                    "Madrasah progress reports",
                    "Water well usage statistics"
                ]
            }
        ],
        reporting: [
            {
                audience: "Investors",
                frequency: "Quarterly",
                contents: [
                    "Financial statements (audited)",
                    "Certification progress",
                    "Dividend forecasts"
                ]
            },
            {
                audience: "Community",
                frequency: "Annual Public Majlis",
                format: [
                    "Open forum with Q&A",
                    "Recorded for transparency",
                    "Impact report publication"
                ]
            }
        ]
    },
    ethicalPolicies: {
        financial: [
            {
                policy: "No Riba",
                implementation: [
                    "Profit-sharing only (no interest loans)",
                    "Islamic bank partnerships",
                    "Contractual gharar avoidance"
                ]
            }
        ],
        employment: [
            {
                policy: "Worker Rights",
                standards: [
                    "Payment before 'sweat dries' (Ibn Majah)",
                    "Protective equipment provision",
                    "Upward mobility training"
                ]
            }
        ],
        sourcing: [
            {
                policy: "Ethical Procurement",
                requirements: [
                    "Fair Trade farmer premiums",
                    "No child labor verification",
                    "Sustainable packaging only"
                ]
            }
        ]
    },
    processingTerminology: {
        stages: [
            {
                name: "Steam Roasting",
                description: "Uses steam at 100-110°C for 15-20 minutes to soften shells while preserving kernel quality",
                purpose: "Makes shells brittle for easier cracking without damaging kernels",
                equipment: "Continuous steam roasters with temperature control"
            },
            {
                name: "Shelling",
                description: "Mechanical process to crack open roasted nuts",
                methods: [
                    "Centrifugal shellers (high capacity)",
                    "Drum shellers (gentler on kernels)"
                ],
                yield: "85-90% whole kernels from quality raw nuts"
            },
            {
                name: "Drying",
                description: "Reduces kernel moisture content to 5-6%",
                parameters: "45-50°C for 6-8 hours in tray dryers",
                importance: "Prevents mold and extends shelf life"
            },
            {
                name: "Peeling",
                description: "Removal of testa (skin) from kernels",
                methods: [
                    "Manual peeling (highest quality)",
                    "Mechanical peelers with abrasive surfaces",
                    "Lye peeling (for industrial grades)"
                ],
                qualityControl: "Hand inspection for complete skin removal"
            },
            {
                name: "Grading",
                description: "Sorting by size, color and defects",
                standards: [
                    "W320 (320-450 kernels per pound)",
                    "W450 (450-500 kernels)",
                    "SW (splits and wholes)",
                    "LP (large pieces)"
                ],
                equipment: [
                    "Vibrating sieves for size grading",
                    "Optical sorters for color/defect detection"
                ]
            }
        ],
        byproducts: [
            {
                name: "CNSL (Cashew Nut Shell Liquid)",
                composition: "Anacardic acid (70%), cardol (18%), cardanol (5%)",
                applications: [
                    "Friction linings (brakes/clutches)",
                    "Surface coatings",
                    "Phenolic resins",
                    "Potential biofuel use"
                ],
                marketValue: "$300-600/ton depending on purity"
            },
            {
                name: "Testa (Skin)",
                use: "Animal feed supplement (high in tannins)",
                disposal: "Composted if not utilized"
            }
        ],
        qualityParameters: [
            {
                parameter: "Moisture Content",
                standard: "<6% for long-term storage",
                testMethod: "Oven drying at 105°C"
            },
            {
                parameter: "Free Fatty Acids",
                standard: "<0.5% for premium grades",
                importance: "Indicates freshness and proper processing"
            },
            {
                parameter: "Insect Damage",
                tolerance: "0% for export grades",
                control: "Fumigation pre-shipment"
            }
        ]
    },

    // Dynamic pricing data with update history
    pricingData: {
        current: {
            rawCashewDomestic: 930, // $/ton
            rawCashewExport: 1100,
            W320Kernels: 6500,
            SWKernels: 5800,
            CNSL: 450,
            lastUpdated: "2024-06-15"
        },
        historical: [
            {
                date: "2024-01-15",
                rawCashewDomestic: 900,
                W320Kernels: 6200
            },
            {
                date: "2023-06-15",
                rawCashewDomestic: 850,
                W320Kernels: 6000
            }
        ],
        sources: [
            "INC (International Nut and Dried Fruit Council)",
            "AFI (African Cashew Alliance)",
            "Local Abidjan market reports"
        ]
    },
    certifications: {
        roadmap: [
            {
                name: "Organic",
                timeline: "2025-2027 (3-year transition)",
                body: "ECOCERT/Control Union",
                cost: "$5,000-$8,000"
            },
            {
                name: "Fair Trade",
                timeline: "2026 audit",
                body: "Fairtrade Africa",
                requirements: [
                    "No child labor",
                    "Protective equipment",
                    "Worker feedback systems"
                ]
            },
            {
                name: "Rainforest Alliance",
                timeline: "2028 assessment",
                focus: "Biodiversity protection"
            }
        ],
        preparation: {
            documentation: [
                "3-year chemical-free land history",
                "Input purchase records",
                "Harvest batch tracking"
            ],
            training: [
                "Organic standards",
                "Halal compliance",
                "Food safety SOPs"
            ]
        }
    },
    faqs: {
        processing: [
            {
                question: "What processing methods do you use?",
                answer: "We employ steam roasting followed by mechanical shelling and manual peeling for premium grades. Our process maintains ISO 22000 food safety standards.",
                keywords: [
                    "process", "method", "methods", "processing", "roasting", "steam", "shelling", "peeling", "grading"
                ]
            },
            {
                question: "How do you ensure food safety?",
                answer: "Through HACCP protocols: 1) Metal detection 2) Moisture control 3) Pest management 4) Sanitation schedules 5) Batch traceability.",
                keywords: [
                    "safety", "HACCP", "hygiene", "quality", "food safety", "clean", "inspection", "standards"
                ]
            },
            {
                question: "What's your kernel recovery rate?",
                answer: "We achieve 25-28% edible kernel yield from raw nuts (industry average is 23-25%). Losses occur mainly during shelling.",
                keywords: [
                    "yield", "recovery", "efficiency", "percentage", "output", "kernel yield", "rate"
                ]
            },
            {
                question: "Do you bleach your cashews?",
                answer: "No - we use steam treatment only. Bleaching (with sulfur dioxide) is avoided to maintain natural flavor and meet organic standards.",
                keywords: [
                    "bleach", "color", "treatment", "natural", "sulfur", "SO2", "chemicals"
                ]
            }
        ],

        quality: [
            {
                question: "What are your moisture standards?",
                answer: "We maintain <6% moisture in final product (tested by oven drying method) to prevent mold growth during storage and shipping.",
                keywords: [
                    "moisture", "standard", "test", "quality", "dryness", "storage", "humidity"
                ]
            },
            {
                question: "How do you prevent rancidity?",
                answer: "Through: 1) Nitrogen flushing in packaging 2) Cold storage 3) Antioxidants (natural tocopherols) 4) Rapid processing after harvest.",
                keywords: [
                    "rancid", "freshness", "preservation", "shelf life", "oxidation", "storage", "packaging"
                ]
            }
        ],
        general: [
            {
                question: "What makes AfriNuts unique?",
                answer: "We combine generational cashew expertise with Islamic ethics - 10% profits fund community mosques, schools and wells while delivering premium products.",
                keywords: [
                    "unique", "difference", "special", "why choose", "advantage", "strength", "competitive"
                ]
            },
            {
                question: "How do you ensure quality?",
                answer: "Through our own farm control, strict grading standards, and future processing center with ISO 22000 certification.",
                keywords: [
                    "quality", "standards", "control", "assurance", "grading", "inspection"
                ]
            }
        ],
        products: [
            {
                question: "What is CNSL?",
                answer: "Cashew Nut Shell Liquid - valuable byproduct used in industrial coatings/resins. We project 70% yield from processing at $450/ton.",
                keywords: [
                    "byproduct", "CNSL", "shell", "liquid", "cashew shell oil", "industrial"
                ]
            },
            {
                question: "Are your products halal?",
                answer: "All operations and products comply with Islamic guidelines. We're pursuing formal Halal certification by 2028 through IVAC/GIMDES.",
                keywords: [
                    "halal", "islamic", "certification", "halal products", "permissible", "sharia"
                ]
            }
        ],
        investment: [
            {
                question: "When do investors get paid?",
                answer: "Dividends start in 2031 (25% of declared profits). Projected $6,731 first year growing to $60,419 by 2036.",
                keywords: [
                    "dividend", "payout", "returns", "profit", "distribution", "timeline"
                ]
            },
            {
                question: "Is my investment Sharia-compliant?",
                answer: "Yes - riba-free structure with profit-sharing. 10% of profits also go to Islamic social projects.",
                keywords: [
                    "islamic", "sharia", "halal", "compliance", "riba", "profit-sharing"
                ]
            }
        ],
        farming: [
            {
                question: "What farming tech do you use?",
                answer: "Drones for crop monitoring, soil sensors, and satellite weather data - all part of our precision agriculture approach.",
                keywords: [
                    "technology", "drones", "farming", "soil sensors", "agriculture", "AI"
                ]
            },
            {
                question: "How do you help farmers?",
                answer: "Through fair pricing guarantees, microloans, training, and profit-sharing - creating mutual dependency for success.",
                keywords: [
                    "farmers", "support", "training", "contracts", "loans", "assistance"
                ]
            }
        ],
        leadership: [
            {
                question: "How are leaders held accountable?",
                answer: "Through quarterly Sharia compliance audits, 360° reviews, and public disclosure of decision-making processes at our Annual Majlis.",
                keywords: [
                    "accountability", "leadership", "review", "audit", "oversight", "responsibility"
                ]
            }
        ],
        finance: [
            {
                question: "Is zakat calculated on company profits?",
                answer: "Yes, 2.5% of liquid assets are distributed annually under supervision of our Sharia Advisor, prioritizing local Muslim communities first.",
                keywords: [
                    "zakat", "charity", "islamic", "obligation", "donation", "alms"
                ]
            }
        ],
        operations: [
            {
                question: "How are conflicts resolved?",
                answer: "Through Shura (consultation) with 75% consensus requirement. Unresolved matters are referred to our Independent Sharia Advisor for binding resolution.",
                keywords: [
                    "conflict", "dispute", "resolution", "problem", "issue", "settlement"
                ]
            }
        ]
    },
        contact: {
            headquarters: "Odienné, Ivory Coast",
            management: [
                "CEO: Hamza S. Ralsan Sangare",
                "Advisor: Sekou Hakim Petter"
            ],
            investorRelations: "investors@afrinuts.com",
            certificationsContact: "certifications@afrinuts.com"
        },
    questionVariations: {
        location: ['where is', 'located', 'address', 'based in', 'headquarters', 'country', 'region'],
        products: ['what do you sell', 'offer', 'produce', 'products', 'goods', 'items', 'range'],
        investment: ['invest', 'funding', 'ROI', 'return', 'capital', 'equity', 'dividend'],
        sustainability: ['eco-friendly', 'green', 'environment', 'sustainable', 'ESG', 'carbon', 'impact'],
        farming: ['grow', 'cultivate', 'harvest', 'plant', 'farm', 'agriculture', 'irrigation'],
        grading: ['grade', 'W320', 'SW', 'LP', 'quality', 'standard', 'sorting'],
        processing: ['process', 'CNSL', 'roast', 'blanch', 'machine', 'shelling', 'value-add'],
        pricing: ['price', 'cost', 'rate', 'value', '$', 'dollar', 'expensive', 'cheap', 'affordable', 'premium', 'market', 'current', 'update', 'trend', 'quotation']
    },
    followUps: {
        location: 'Would you like details about our farming regions or office locations?',
        products: 'Are you interested in raw cashews or processed products?',
        investment: 'Would you like information about investment terms or projected returns?',
        sustainability: 'Would you like to know about our farming practices or processing sustainability?',
        processing: 'Would you like details on any specific processing stage?',
        pricing: 'Would you like historical pricing data or market trends?'
    }
};