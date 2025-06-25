import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "../../../prisma/src/database/client";
import { hashPassword } from "@src/utils/pwd";

const prisma = new PrismaClient();
const User = prisma.users;
const UserRoles = prisma.user_roles;

export type UserType = {
    id: number;
    username: string;
    email: string;
    role?: number; // 1 - admin / 2 - manager / 3 - inventory
    password_hash: string;
    full_name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
};

export class UserController {
    static async getUsers(_request: FastifyRequest, reply: FastifyReply) {
        const users: UserType[] = await User.findMany();
        reply.send(users);
    }

    static async storeUser(
        request: FastifyRequest<{ Body: UserType }>,
        reply: FastifyReply
    ) {
        const { username, email, full_name, role, password_hash } =
            request.body;

        console.log(username, email, full_name, role, password_hash);
        if (!username || !email || !password_hash || !full_name) {
            return reply.code(400).send({
                message:
                    "Campos obrigatórios ausentes: username, email, password, fullName.",
            });
        }

        let hashedPassword = await hashPassword(password_hash);
        await prisma.$transaction(async (tx) => {
            try {
                const user = await tx.users.create({
                    data: {
                        email,
                        username,
                        full_name,
                        password_hash: hashedPassword,
                    },
                });

                if (!user) {
                    return reply
                        .code(500)
                        .send({ message: "Failed to create user" });
                }
                if (user) {
                    const userRole = await tx.user_roles.create({
                        data: {
                            user_id: user.id,
                            role_id: role || 6,
                        },
                    });

                    if (!userRole) {
                        return reply
                            .code(500)
                            .send({ message: "Failed to assign role" });
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                return reply
                    .code(500)
                    .send({ message: "Internal server error" });
            }
        });
        reply.code(201).send("thank you for creating a user");
    }

    static async getUserById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        const user = await User.findUnique({ where: { id: Number(id) } });
        if (!user) return reply.code(404).send({ message: "User not found" });
        reply.send(user);
    }

    static async updateUserById(
        request: FastifyRequest<{
            Params: { id: string };
            Body: Partial<UserType>;
        }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        const data = request.body;
        try {
            const user = await User.update({
                where: { id: Number(id) },
                data,
            });
            reply.send(user);
        } catch {
            reply.code(404).send({ message: "User not found" });
        }
    }

    static async deleteUserById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        const { id } = request.params;
        try {
            await User.delete({ where: { id: Number(id) } });
            reply.code(204).send();
        } catch {
            reply.code(404).send({ message: "User not found" });
        }
    }
}
