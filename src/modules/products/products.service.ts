import { PrismaClient } from "../../../prisma/src/database/client";

const prisma = new PrismaClient();

type CategoryCreateInput = {
    name: string;
    description?: string | null;
};

export type ProductType = {
    id?: number;
    sku: string;
    barcode?: string | null;
    name: string;
    description?: string | null;
    category_id?: number | null;
    unit_of_measure?: string;
    cost_price?: any | null;
    selling_price?: any | null;
    min_stock_level?: any | null;
    max_stock_level?: any | null;
    reorder_point?: any | null;
    weight?: any | null;
    dimensions?: string | null;
    is_active?: boolean;
    is_serialized?: boolean;
    has_batches?: boolean;
    created_at?: Date;
    updated_at?: Date;
    created_by?: number | null;
};

export class ProductService {
    static async create(data: ProductType) {
        return prisma.products.create({ data });
    }

    static async findById(id: number) {
        return prisma.products.findUnique({ where: { id } });
    }

    static async findBySku(sku: string) {
        return prisma.products.findUnique({ where: { sku } });
    }

    static async findByBarcode(barcode: string) {
        return prisma.products.findMany({ where: { barcode } });
    }

    static async createCategory(data: CategoryCreateInput) {
        return prisma.categories.create({ data });
    }

    static async findCategoryById(id: number) {
        return prisma.categories.findUnique({ where: { id } });
    }

    static async findCategoryByName(name: string) {
        return prisma.categories.findFirst({ where: { name } });
    }
}
