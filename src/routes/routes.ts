import { FastifyInstance } from "fastify";

import type { FastifyTypedInstance } from "../types/fastify_types";

import { userRoutes } from "./UsersRoutes";
import { notificationsRoutes } from "./NotificationsRoutes";
import { contributorsRoutes } from "./contributorsRoutes";
import { documentsRoutes } from "./documentsRoutes";



export async function routes(app:FastifyTypedInstance) {
 userRoutes(app)
 contributorsRoutes(app)
 documentsRoutes(app)
 notificationsRoutes(app)


}