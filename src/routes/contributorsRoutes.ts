import { FastifyTypedInstance } from "../types/fastify_types";
import ContributorsController from "../controllers/ContributorsController";
import ContributorsSchemas from "../schemas/ContributorsSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";

export async function contributorsRoutes(app: FastifyTypedInstance) {
  const controller = new ContributorsController();

  app.post(
    "/contributors/register",
    {
      schema: {
        description: "Register a new contributor",
        tags: ["Contributors"],
        body: ContributorsSchemas.registerContributor,
       
        response: {
          200: ContributorsSchemas.successResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const validBody = ContributorsSchemas.registerContributor.parse(request.body);
     
      return reply.status(200).send(await controller.register(validBody));
    }
  );

  app.put(
    "/contributors",
    {
      schema: {
        description: "Update a contributor",
        tags: ["Contributors"],
        body: ContributorsSchemas.updateContributor,
        headers: ContributorsSchemas.token,
        response: {
          200: ContributorsSchemas.successResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const validBody = ContributorsSchemas.updateContributor.parse(request.body);
      const validToken = ContributorsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.update(validBody, validToken));
    }
  );

  app.get(
    "/contributors/view-a",
    {
      schema: {
        description: "View a single contributor",
        tags: ["Contributors"],
        headers: ContributorsSchemas.token,
        response: {
          200: ContributorsSchemas.contributor,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const validToken = ContributorsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.viewA(validToken));
    }
  );

  app.get(
    "/contributors",
    {
      schema: {
        description: "View all contributors",
        tags: ["Contributors"],
        headers: ContributorsSchemas.token,
        response: {
          200: ContributorsSchemas.contributors,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const validToken = ContributorsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.viewAll(validToken));
    }
  );

  app.delete(
    "/contributors",
    {
      schema: {
        description: "Delete a contributor",
        tags: ["Contributors"],
        body: ContributorsSchemas.deleteContributor,
        headers: ContributorsSchemas.token,
        response: {
          200: ContributorsSchemas.successResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const validBody = ContributorsSchemas.deleteContributor.parse(request.body);
      const validToken = ContributorsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.delete(validBody, validToken));
    }
  );
}