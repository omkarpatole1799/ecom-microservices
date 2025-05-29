export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
