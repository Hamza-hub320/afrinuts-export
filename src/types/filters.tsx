export type ProductAvailability = 'all' | 'available' | 'coming-soon';
export type ProductCategory = 'all' | 'raw' | 'processed' | 'byproducts';

export interface ProductFilters {
    availability: ProductAvailability;
    category: ProductCategory;
    searchQuery: string;
    certifications: string[]; // e.g., ['organic', 'halal']
}

// Optional: You might also want to add your Product and ProductVariant types here
// if they're used across multiple components
export interface ProductVariant {
    name: string;
    priceRange: string;
}

export interface Product {
    id: string;
    name: string;
    type: 'raw' | 'processed' | 'byproduct';
    description: string;
    icon: string;
    backgroundImage: string;
    features: string[];
    available: boolean;
    comingSoon?: string;
    certifications?: string[];
    variants?: ProductVariant[];
}