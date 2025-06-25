import { FastifyInstance } from "fastify";
import { UserController } from "./users.controller";

export async function userRoutes(f: FastifyInstance) {
    f.get("/", UserController.getUsers);

    f.post("/", UserController.storeUser);

    f.get("/:id", UserController.getUserById);

    f.put("/:id", UserController.updateUserById);

    f.delete("/:id", UserController.deleteUserById);
}
