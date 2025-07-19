// src/types/translations.ts
export interface NewsItem {
    key: string;
    title: string;
    date: string;
    category: string;
    description: string;
    image?: string;
    metaClass?: string;
}

export interface Product {
    key: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
    available: boolean;
    comingSoon?: string;
}

export interface FarmHighlight {
    title: string;
    description: string;
    icon: string;
}

export interface Product {
    key: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
    available: boolean;
    comingSoon?: string;
}

export interface FarmHighlight {
    key: string;
    title: string;
    description: string;
    icon: string;
}

export interface SustainabilityFeature {
    key: string;
    title: string;
    description: string;
    icon: string;
}

export interface NewsItem {
    key: string;
    title: string;
    date: string;
    category: string;
    description: string;
    metaClass?: string;
}