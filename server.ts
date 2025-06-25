import Fastify, { FastifyInstance } from "fastify";
import routes from "./src/routes/index";

const server: FastifyInstance = Fastify({
    logger: true,
});

// const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/productdb";

// mongoose
//     .connect(mongoUri)
//     .then(() => {
//         server.log.info("MongoDB connected successfully");
//     })
//     .catch((err) => {
//         server.log.error("MongoDB connection error:", err);
//         process.exit(1);
//     });

server.register(routes, { prefix: "/api/v1" });


const main = async () => {
    try {
        const port = parseInt(process.env.PORT ?? "8181");
        await server.listen({ port: port, host: "0.0.0.0" });
        server.log.info(`Server is running`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

main();
