import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "../../../prisma/src/database/client";

const prisma = new PrismaClient();
const Location = prisma.locations;

type LocationType = {
    id: number;
    name: string;
    type: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isActive: boolean;
};

export class LocationController {
    static async storeLocation(
        request: FastifyRequest<{ Body: LocationType }>,
        reply: FastifyReply
    ) {
        try {
            const location = request.body;
            reply.code(201).send(location);
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    }

    static async getLocations(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        try {
            const locations = await Location.findMany();
            if (locations?.length === 0) {
                return reply.code(404).send({ message: "No locations found" });
            }

            reply.send(locations);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.stack);
            } else {
                console.log(error);
            }
            reply.code(500).send({ message: "Internal server error" });
        }
    }

    static async getLocationById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { id } = request.params;
            const location = await Location.findUnique({
                where: { id: parseInt(id, 10) },
            });
            if (!location) {
                return reply.code(404).send({ message: "Location not found" });
            }
            reply.send(location);
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    }

    static async getLocationByName(
        request: FastifyRequest<{ Params: { name: string } }>,
        reply: FastifyReply
    ) {
        try {
            const { name } = request.params;
            const location = await Location.findFirst({
                where: { name: name },
            });
            if (!location) {
                return reply.code(404).send({ message: "Location not found" });
            }
            reply.send(location);
        } catch (error) {
            reply.code(500).send({ message: "Internal server error" });
        }
    }
}
