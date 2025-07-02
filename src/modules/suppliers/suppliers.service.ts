import { PrismaClient } from "../../../prisma/src/database/client";

const prisma = new PrismaClient();

type SupplierCreateInput = {
    name: string;
    created_by?: number;
};

type SupplierUpdateInput = Partial<
    SupplierCreateInput & {
        legal_name?: string;
        tax_id?: string;
        contact_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
        status?: "active" | "inactive" | "blocked";
        payment_terms?: string;
        lead_time_days?: number;
    }
>;

export class SuppliersService {
    static async findAll() {
        return prisma.suppliers.findMany();
    }

    static async create(data: SupplierCreateInput) {
        return prisma.suppliers.create({ data });
    }

    static async findById(id: number) {
        return prisma.suppliers.findUnique({ where: { id } });
    }

    static async update(id: number, data: SupplierUpdateInput) {
        return prisma.suppliers.update({
            where: { id },
            data,
        });
    }

    static async delete(id: number) {
        return prisma.suppliers.delete({ where: { id } });
    }
}
