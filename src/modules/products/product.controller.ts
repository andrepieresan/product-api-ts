import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "../../../prisma/src/database/client";

const prisma = new PrismaClient();
const Product = prisma.products;
const Category = prisma.categories;

type CategoryRequestBody = {
    id: number;
    name: string;
    description?: string | null;
    company_id: number | null;
    createdAt: Date;
    updatedAt: Date;
};

type ProductRequestBody = {
    id: number;
    sku: string;
    barcode?: string | null;
    name: string;
    description?: string | null;
    categoryId?: number | null;
    unitOfMeasure: string;
    costPrice?: number | null;
    sellingPrice?: number | null;
    minStockLevel?: number | null;
    maxStockLevel?: number | null;
    reorderPoint?: number | null;
    weight?: number | null;
    dimensions?: string | null;
    isActive: boolean;
    isSerialized: boolean;
    hasBatches: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdById?: number | null;
};

export class ProductController {
    static async store(
        request: FastifyRequest<{ Body: ProductRequestBody }>,
        reply: FastifyReply
    ) {
        try {
            const {
                id,
                sku,
                barcode,
                name,
                description,
                categoryId,
                unitOfMeasure,
                costPrice,
                sellingPrice,
                minStockLevel,
                maxStockLevel,
                reorderPoint,
                weight,
                dimensions,
                isActive,
                isSerialized,
                hasBatches,
                createdAt,
                updatedAt,
                createdById,
            } = request.body;

            const product = await Product.create({
                data: {
                    id,
                    sku,
                    barcode,
                    name,
                    description,
                    categoryId,
                    unitOfMeasure,
                    costPrice,
                    sellingPrice,
                    minStockLevel,
                    maxStockLevel,
                    reorderPoint,
                    weight,
                    dimensions,
                    isActive,
                    isSerialized,
                    hasBatches,
                    createdAt,
                    updatedAt,
                    createdById,
                },
            });
            reply.code(201).send(product);
        } catch (error) {
            reply.code(500).send({ error: "Failed to create product" });
        }
    }

    static async getProductById(
        request: FastifyRequest<{ Params: { id: number } }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        try {
            const product = await Product.findUnique({
                where: {
                    id,
                },
            });
            if (!product) {
                return reply
                    .code(404)
                    .send({ error: `Product - #${id} - not found` });
            }
            reply.send(product);
        } catch (error) {
            reply.code(500).send({ error: `Failed to fetch product - #${id}` });
        }
    }

    static async getProductBySku(
        request: FastifyRequest<{ Params: { sku: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { sku } = request.params;
            const product = await Product.findUnique({ where: { sku } });
            if (!product) {
                return reply.code(404).send({ error: "Product not found" });
            }
            reply.send(product);
        } catch (error) {
            reply.code(500).send({ error: "Failed to fetch product" });
        }
    }

    static async getProductsByBarcode(
        request: FastifyRequest<{ Params: { barcode: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { barcode } = request.params;
            const product = await Product.findMany({ where: { barcode } });
            if (!product) {
                return reply.code(404).send({ error: "Product not found" });
            }
            reply.send(product);
        } catch (error) {
            reply.code(500).send({ error: "Failed to fetch product" });
        }
    }

    static async storeCategory(
        request: FastifyRequest<{ Body: CategoryRequestBody }>,
        reply: FastifyReply
    ) {
        try {
            const { id, name, description, createdAt, updatedAt } =
                request.body;
            const category = await Category.create({
                data: {
                    id,
                    name,
                    description,
                },
            });
            reply.code(201).send(category);
        } catch (error) {
            reply.code(500).send({ error: "Failed to create category" });
        }
    }

    static async getCategoryById(
        request: FastifyRequest<{ Params: { id: number } }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        try {
            const category = await Category.findUnique({ where: { id } });
            if (!category) {
                return reply
                    .code(404)
                    .send({ error: `Category - #${id} - not found` });
            }
            reply.send(category);
        } catch (error) {
            reply
                .code(500)
                .send({ error: `Failed to fetch category - #${id}` });
        }
    }

    static async getCategoryByName(
        request: FastifyRequest<{ Params: { name: string } }>,
        reply: FastifyReply
    ) {
        const { name } = request.params;
        try {
            const category = await Category.findFirst({ where: { name } });
            if (!category) {
                return reply
                    .code(404)
                    .send({ error: `Category - ${name} - not found` });
            }
            reply.send(category);
        } catch (error) {
            reply
                .code(500)
                .send({ error: `Failed to fetch category - ${name}` });
        }
    }
}
