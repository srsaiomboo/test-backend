import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import DocumentsSchemas from '../schemas/DocumentsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import TokenService from '../services/TokensServices';
import FileService from '../services/StorageServices';
import path from 'path';
import { FastifyRequest } from 'fastify';
import EmailService from "../services/EmailsServices";

class DocumentsController {
  private tokenService: TokenService = new TokenService();
  private fileService: FileService = new FileService();
  private readonly responseSchema = DocumentsSchemas.successResponse;
  private emailService: EmailService = new EmailService();

  public async register(data: z.infer<typeof DocumentsSchemas.registerDocument>, key: z.infer<typeof DocumentsSchemas.token>, file: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = data;
    const validatedKey = key;
    if (!validatedData) {
      throw new InvalidDataException("Request Body is null");
    }
    const { description, typeDocument, name} = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      if (!file) {
        throw new InvalidDataException('File not provided');
      }

      const contributor = await prisma.contributors.findFirst({ where: { idUser: Number(userId) } });
      if (!contributor) {
        throw new ItemNotFoundException("Contributor not found");
      }

      const fileBuffer = await file.toBuffer();
      const fileName = Date.now() + path.extname(file.filename);

      console.log('[REGISTER] File buffer length:', fileBuffer.length);
      console.log('[REGISTER] File name:', fileName);

      await this.fileService.saveFile(fileBuffer, fileName, 'documents/');

      const document = await prisma.documents.create({
        data: {
          description,
          fileUrl: fileName,
          typeDocument: Number(typeDocument),
          name,
          status: true,
          createdIn: new Date(),
          updatedIn: new Date(),
          idContributor:  contributor.id,
        },
      });

      
      return { message: 'Document registered successfully' };
    } catch (error) {
      console.error('[REGISTER] Error occurred:', error);
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException ||
        error instanceof ItemNotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register document');
    }
  }

  public async update(data: z.infer<typeof DocumentsSchemas.updateDocument>, key: z.infer<typeof DocumentsSchemas.token>, file: any): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = data;
    const validatedKey = key;
    if (!validatedData) {
      throw new InvalidDataException("Request Body is null");
    }
    const { id, description, typeDocument, name, status, idContributor } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const document = await prisma.documents.findUnique({ where: { id: Number(id) } });
      if (!document) {
        throw new ItemNotFoundException('Document not found');
      }

      const contributor = await prisma.contributors.findUnique({ where: { id: Number(idContributor) } });
      if (!contributor) {
        throw new ItemNotFoundException("Contributor not found");
      }

      let fileName = document.fileUrl;
      if (file) {
        const fileBuffer = await file.toBuffer();
        fileName = Date.now() + path.extname(file.filename);
        console.log('[UPDATE] File buffer length:', fileBuffer.length);
        console.log('[UPDATE] File name:', fileName);
        await this.fileService.saveFile(fileBuffer, fileName, 'documents/');
      }

      await prisma.documents.update({
        where: { id: Number(id) },
        data: {
          description,
          fileUrl: fileName,
          typeDocument: Number(typeDocument),
          name,
          status: Boolean(status),
          updatedIn: new Date(),
          idContributor: Number(idContributor),
        },
      });

      return { message: 'Document updated successfully' };
    } catch (error) {
      console.error('[UPDATE] Error occurred:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update document');
    }
  }

  public async delete(data: z.infer<typeof DocumentsSchemas.deleteDocument>, key: z.infer<typeof DocumentsSchemas.token>): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = data;
    const validatedKey = key;
    const { id } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const document = await prisma.documents.findUnique({ where: { id } });
      if (!document) {
        throw new ItemNotFoundException('Document not found');
      }

      await prisma.documents.delete({ where: { id } });

      return { message: 'Document deleted successfully' };
    } catch (error) {
      console.error('[DELETE] Error occurred:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete document');
    }
  }

  public async viewA(data: z.infer<typeof DocumentsSchemas.viewDocument>, key: z.infer<typeof DocumentsSchemas.token>, req: FastifyRequest): Promise<z.infer<typeof DocumentsSchemas.document>> {
    const validatedData = data;
    const validatedKey = key;
    const { id } = validatedData;
    const { token } = validatedKey;

    try {
      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new AuthorizationException('Not authorized');
      }

      const document = await prisma.documents.findUnique({ where: { id: Number(id) } });
      if (!document) {
        throw new ItemNotFoundException('Document not found');
      }

      if (document.fileUrl) {
        document.fileUrl = this.fileService.generateLink('documents', req, document.fileUrl);
      }

      return DocumentsSchemas.document.parse(document);
    } catch (error) {
      console.error('[VIEW] Error occurred:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve document');
    }
  }

  public async viewAll(req: FastifyRequest): Promise<z.infer<typeof DocumentsSchemas.documentList>> {
    try {
      const documentList = await prisma.documents.findMany();

      for (const document of documentList) {
        if (document.fileUrl) {
          document.fileUrl = this.fileService.generateLink('documents', req, document.fileUrl);
        }
      }

      return DocumentsSchemas.documentList.parse(documentList);
    } catch (error) {
      console.error('[VIEW_ALL] Error occurred:', error);
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve documents');
    }
  }

  public async uploadFile(data: z.infer<typeof DocumentsSchemas.uploadFileDocument>, file: any, req: FastifyRequest, key: z.infer<typeof DocumentsSchemas.token>): Promise<z.infer<typeof this.responseSchema>> {
    const validatedData = data;
    const validatedKey = key;
    const { id } = validatedData;
    const { token } = validatedKey;

    try {
      if (!await this.tokenService.checkTokenUser(token)) {
        throw new AuthorizationException('Not authorized');
      }

      const userId = await this.tokenService.userId(token);
      if (!userId) {
        throw new InvalidDataException('Invalid ID');
      }

      const document = await prisma.documents.findUnique({ where: { id: Number(id) } });
      if (!document) {
        throw new ItemNotFoundException('Document not found');
      }

      const fileBuffer = await file.toBuffer();
      const fileName = Date.now() + path.extname(file.filename);

      await this.fileService.saveFile(fileBuffer, fileName, 'documents/');

      await prisma.documents.update({
        where: { id: Number(id) },
        data: { fileUrl: fileName, updatedIn: new Date() },
      });

      return { message: 'Document file uploaded successfully' };
    } catch (error) {
      console.error('[UPLOAD_FILE] Error occurred:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to upload document file');
    }
  }
}

export default DocumentsController;