import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "../../../prisma/src/database/client";

const prisma = new PrismaClient();
const Suppliers = prisma.suppliers;

type SupplierType = {
    id: number;
    name: string;
    legal_name?: string | null;
    tax_id?: string | null;
    contact_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
    status: "active" | "inactive" | string;
    payment_terms?: string | null;
    lead_time_days?: number | null;
    created_at: Date;
    updated_at: Date;
    created_by?: number | null;
};

export class SuppliersController {
    static async getSuppliers(request: FastifyRequest, reply: FastifyReply) {
        try {
            const suppliers = await Suppliers.findMany();
            reply.send(suppliers);
        } catch (err) {
            reply
                .code(500)
                .send({ error: "Failed to fetch suppliers", details: err });
        }
    }

    static async createSupplier(
        request: FastifyRequest<{ Body: SupplierType }>,
        reply: FastifyReply
    ) {
        try {
            const { name, created_by } = request.body;
            const supplier = await Suppliers.create({
                data: {
                    name,
                    created_by,
                },
            });
            if (!supplier)
                return reply
                    .code(400)
                    .send({ error: "Failed to create supplier" });
            reply.code(201).send('supplier created successfully');
        } catch (err) {
            reply
                .code(400)
                .send({ error: "Failed to create supplier", details: err });
        }
    }

    static async getSupplier(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const id = Number(request.params.id);
            const supplier = await Suppliers.findUnique({ where: { id } });
            if (!supplier)
                return reply.code(404).send({ error: "Supplier not found" });
            reply.send(supplier);
        } catch (err) {
            reply
                .code(400)
                .send({ error: "Failed to fetch supplier", details: err });
        }
    }

    // static async updateSupplier(
    //     request: FastifyRequest<{ Params: { id: string }; Body: SupplierType }>,
    //     reply: FastifyReply
    // ) {
    //     try {
    //         const id = Number(request.params.id);
    //         const data = request.body;
    //         const supplier = await Suppliers.update({
    //             where: { id },
    //             data,
    //         });
    //         reply.send(supplier);
    //     } catch (err) {
    //         reply
    //             .code(400)
    //             .send({ error: "Failed to update supplier", details: err });
    //     }
    // }

    static async deleteSupplier(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const id = Number(request.params.id);
            await Suppliers.delete({ where: { id } });
            reply.code(204).send();
        } catch (err) {
            reply
                .code(400)
                .send({ error: "Failed to delete supplier", details: err });
        }
    }
}
