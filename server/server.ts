import { config } from "dotenv";
config();

import fastify from "fastify";
import cors from "@fastify/cors";
import { userRoutes } from "./routes/users";

const app = fastify();
app.register(cors, { origin: process.env.CLIENT_URL });
app.register(userRoutes);

const port = process.env.PORT || 3010;
app.listen({ port: +port });
