import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "../../../prisma/src/database/client";

const prisma = new PrismaClient();
const Inventary = prisma.inventory;

type InventaryType = {
    id?: number;
    productId: number;
    locationId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export class InventaryController {
    static async storeInventary(
        request: FastifyRequest<{ Body: InventaryType }>,
        reply: FastifyReply
    ) {
        try {
            const data = request.body;
            const inventary = await Inventary.create({ data });
            reply.code(201).send(inventary);
        } catch (error) {
            reply.code(400).send({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }

    static async getInventaryByProductId(
        request: FastifyRequest<{ Params: { product_id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { product_id } = request.params;
            const inventary = await Inventary.findMany({
                where: { productId: Number(product_id) },
            });
            reply.send(inventary);
        } catch (error) {
            reply.code(500).send({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
        }
    }

    static async getInventaryByProductName(
        request: FastifyRequest<{ Params: { product_name: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { product_name } = request.params;
            const inventary = await Inventary.findMany({
                where: {
                    product: { name: product_name },
                },
                include: { product: true },
            });
            reply.send(inventary);
        } catch (error) {
            reply.code(500).send({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
        }
    }

    static async getInventaryByLocationId(
        request: FastifyRequest<{ Params: { location_id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { location_id } = request.params;
            const inventary = await Inventary.findMany({
                where: { locationId: Number(location_id) },
            });
            reply.send(inventary);
        } catch (error) {
            reply.code(500).send({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
        }
    }

    static async getProductIdByLocationId(
        request: FastifyRequest<{
            Params: { location_id: string; product_id: string };
        }>,
        reply: FastifyReply
    ) {
        try {
            const { location_id, product_id } = request.params;
            const inventary = await Inventary.findFirst({
                where: {
                    locationId: Number(location_id),
                    productId: Number(product_id),
                },
            });
            if (!inventary) {
                reply.code(404).send({ error: "Inventary not found" });
                return;
            }
            reply.send(inventary);
        } catch (error) {
            reply.code(500).send({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
        }
    }

    static async getProductNameByLocationId(
        request: FastifyRequest<{
            Params: { location_id: string; product_name: string };
        }>,
        reply: FastifyReply
    ) {
        try {
            const { location_id, product_name } = request.params;
            const inventary = await Inventary.findFirst({
                where: {
                    locationId: Number(location_id),
                    product: { name: product_name },
                },
                include: { product: true },
            });
            if (!inventary) {
                reply.code(404).send({ error: "Inventary not found" });
                return;
            }
            reply.send(inventary);
        } catch (error) {
            reply.code(500).send({
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            });
        }
    }

    static async deleteLocationById(
        request: FastifyRequest<{ Body: { id: number } }>,
        reply: FastifyReply
    ) {
        const { id } = request.body;
        try {
            await Inventary.delete({ where: { id } });
            reply.send({ success: true });
        } catch (error: any) {
            if (
                error instanceof Error &&
                "code" in error &&
                error.code === "P2025"
            ) {
                reply.code(404).send({ error: "Inventary not found" });
            } else {
                reply.code(500).send({
                    error:
                        error instanceof Error
                            ? error.message
                            : "Internal server error",
                });
            }
        }
    }

    static async storeMovement(request: FastifyRequest, reply: FastifyReply) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getMovements(request: FastifyRequest, reply: FastifyReply) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getMovementsByProductId(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getMovementsByLocation(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }

    static async storeCounts(request: FastifyRequest, reply: FastifyReply) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async storeItemInCount(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async updateinventaryItemCounts(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getinventaryGroupByLocation(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getinventaryCountsByLocationId(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async finalizeinventaryCount(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getDiscrepancies(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async approveinventaryCount(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getDiscrepanciesByLocation(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }

    static async storeAdjustment(request: FastifyRequest, reply: FastifyReply) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getAdjustmentsByLocationId(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getAdjustmentsByLocationName(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getAdjustmentsByCountId(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
    static async getAdjustmentsById(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        reply.code(501).send({ error: "Not implemented" });
    }
}
