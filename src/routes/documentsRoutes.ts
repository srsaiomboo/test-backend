import { FastifyTypedInstance } from "../types/fastify_types";
import DocumentsController from "../controllers/DocumentsController";
import DocumentsSchemas from "../schemas/DocumentsSchemas";
import ResponsesSchemas from "../schemas/ResponsesSchemas";
import type { FastifyReply } from "fastify";
import DataExtracMultipart from "../utils/fastify_multipart_data_extraction";

export async function documentsRoutes(app: FastifyTypedInstance) {
  const controller = new DocumentsController();
  const extractData = new DataExtracMultipart();

  // Register a new document
  app.post(
    "/documents/register",
    {
      schema: {
        description: "Register a new document",
        tags: ["Documents"],
        consumes: ["multipart/form-data"],
        body: DocumentsSchemas.registerDocument,
        headers: DocumentsSchemas.token,
        response: {
          200: DocumentsSchemas.successResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const file = await request.file();
      const data = await extractData.extractFields(file);
      const validBody = DocumentsSchemas.registerDocument.parse(data);
      const validToken = DocumentsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.register(validBody, validToken, file));
    }
  );

  // Update a document
  app.put(
    "/documents/update",
    {
      schema: {
        description: "Update a document",
        tags: ["Documents"],
        consumes: ["multipart/form-data"],
        body: DocumentsSchemas.updateDocument,
        headers: DocumentsSchemas.token,
        response: {
          200: DocumentsSchemas.successResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const file = await request.file();
      const data = await extractData.extractFields(file);
      const validBody = DocumentsSchemas.updateDocument.parse(data);
      const validToken = DocumentsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.update(validBody, validToken, file));
    }
  );

  // Delete a document
  app.delete(
    "/documents",
    {
      schema: {
        description: "Delete a document",
        tags: ["Documents"],
        body: DocumentsSchemas.deleteDocument,
        headers: DocumentsSchemas.token,
        response: {
          200: DocumentsSchemas.successResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const validBody = DocumentsSchemas.deleteDocument.parse(request.body);
      const validToken = DocumentsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.delete(validBody, validToken));
    }
  );

  // View a single document
  app.get(
    "/documents/:id",
    {
      schema: {
        description: "View a single document",
        tags: ["Documents"],
        headers: DocumentsSchemas.token,
        params: DocumentsSchemas.viewDocument,
        response: {
          200: DocumentsSchemas.document,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const validParams = DocumentsSchemas.viewDocument.parse(request.params);
      const validToken = DocumentsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.viewA(validParams, validToken, request));
    }
  );

  // View all documents
  app.get(
    "/documents",
    {
      schema: {
        description: "View all documents",
        tags: ["Documents"],
        response: {
          200: DocumentsSchemas.documentList,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send(await controller.viewAll(request));
    }
  );

  // Upload a document file
  app.patch(
    "/documents/upload-file",
    {
      schema: {
        description: "Upload a file for a document",
        tags: ["Documents"],
        consumes: ["multipart/form-data"],
        headers: DocumentsSchemas.token,
        response: {
          200: DocumentsSchemas.successResponse,
          400: ResponsesSchemas.error_400_response,
          401: ResponsesSchemas.general_error_response,
          404: ResponsesSchemas.general_error_response,
          500: ResponsesSchemas.general_error_response,
        },
      },
    },
    async (request, reply) => {
      const file = await request.file();
      const data = await extractData.extractFields(file);
      const validBody = DocumentsSchemas.uploadFileDocument.parse(data);
      const validToken = DocumentsSchemas.token.parse(request.headers);
      return reply.status(200).send(await controller.uploadFile(validBody, file, request, validToken));
    }
  );
}