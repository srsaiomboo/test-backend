import { z } from 'zod';
import { prisma } from '../config/PrismaClient';
import ContributorsSchemas from '../schemas/ContributorsSchemas';
import InvalidDataException from '../errors/InvalidDataException';
import ItemNotFoundException from '../errors/ItemNotFoundException';
import AuthorizationException from '../errors/AuthorizationException';
import InternalServerErrorException from '../errors/InternalServerErrorException';
import ItemAlreadyExistsException from '../errors/ItemAlreadyExistsException';
import TokenService from '../services/TokensServices';
import EmailService from '../services/EmailsServices';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

const uploadsPath = path.resolve(__dirname, '../../storage/contributors');
const saltRounds = 10;

class ContributorsController {
  private tokenService: TokenService = new TokenService();
  private readonly responseSchema = ContributorsSchemas.successResponse;
  private emailService: EmailService = new EmailService();

  private generateRandomPassword(length: number = 12): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  private async validateUser(token: string): Promise<number> {
    const userId = await this.tokenService.userId(token);
    if (!userId) {
      throw new AuthorizationException('Not authorized');
    }
    return userId;
  }

  private async createContributorDirectory(userId: number): Promise<string> {
    const pathName = `${Date.now()}-${userId}`;
    const folderPath = path.join(uploadsPath, pathName);
    try {
      await fs.promises.mkdir(folderPath, { recursive: true });
      return pathName;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create contributor directory');
    }
  }

  public async register(
    data: z.infer<typeof ContributorsSchemas.registerContributor>,
   
  ): Promise<z.infer<typeof this.responseSchema>> {
    const { fullName, gender, biNumber, dateOfBirth, phoneNumber, province, municipality, neighborhood, email} = data;


    try {
   

      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
        throw new ItemAlreadyExistsException('User already exists');
      }

      const existingContributor = await prisma.contributors.findFirst({ where: { biNumber } });
      if (existingContributor) {
        throw new InvalidDataException('BI number already registered');
      }

      const password = this.generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await prisma.users.create({
        data: {
          name: fullName,
          email,
          status: true,
          role:1,
          password: hashedPassword,
          createdIn: new Date(),
          updatedIn: new Date(),
        },
      });

      const pathName = await this.createContributorDirectory(newUser.id);
      await prisma.users.update({
        where: { id: newUser.id },
        data: { path: pathName },
      });

      const contributor = await prisma.contributors.create({
        data: {
          fullName,
          gender,
          biNumber,
          dateOfBirth: new Date(dateOfBirth),
          phoneNumber,
          province,
          municipality,
          neighborhood,
          email,
          status: true,
          createdIn: new Date(),
          updatedIn: new Date(),
          idUser: newUser.id,
        },
      });

      console.log('[REGISTER] Contributor created:', contributor);
      if (!await this.emailService.send_message_code(email, password)) {
        await prisma.users.delete({ where: { id: newUser.id } });
        
        throw new InvalidDataException("An error occurred while sending email");
      }
      return { message: 'Contributor registered successfully' };
    } catch (error) {
      console.error('[REGISTER] Error occurred:', error);
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException ||
        error instanceof ItemNotFoundException ||
        error instanceof ItemAlreadyExistsException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to register contributor');
    }
  }

  public async update(
    data: z.infer<typeof ContributorsSchemas.updateContributor>,
    key: z.infer<typeof ContributorsSchemas.token>
  ): Promise<z.infer<typeof this.responseSchema>> {
    const { id, fullName, gender, biNumber, dateOfBirth, phoneNumber, province, municipality, neighborhood, email, status } = data;
    const { token } = key;

    try {
      await this.validateUser(token);

      const contributor = await prisma.contributors.findUnique({ where: { id } });
      if (!contributor) {
        throw new ItemNotFoundException('Contributor not found');
      }

      const updatedContributor = await prisma.contributors.update({
        where: { id },
        data: {
          fullName,
          gender,
          biNumber,
          dateOfBirth: new Date(dateOfBirth as string),
          phoneNumber,
          province,
          municipality,
          neighborhood,
          email,
          status: Boolean(status),
          updatedIn: new Date(),
        },
      });

      console.log('[UPDATE] Contributor updated:', updatedContributor);

      return { message: 'Contributor updated successfully' };
    } catch (error) {
      console.error('[UPDATE] Error occurred:', error);
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException ||
        error instanceof ItemNotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to update contributor');
    }
  }

  public async viewA(key: z.infer<typeof ContributorsSchemas.token>): Promise<z.infer<typeof ContributorsSchemas.contributor>> {
    const { token } = key;

    try {
      const userId = await this.validateUser(token);

      const contributor = await prisma.contributors.findFirst({
        where: { idUser: userId },
        include: { user: true , documents:true},
      });

      if (!contributor) {
        throw new ItemNotFoundException('Contributor not found');
      }

      return ContributorsSchemas.contributor.parse(contributor);
    } catch (error) {
      console.error('[VIEW] Error occurred:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve contributor');
    }
  }

  public async viewAll(key: z.infer<typeof ContributorsSchemas.token>): Promise<z.infer<typeof ContributorsSchemas.contributors>> {
    const { token } = key;

    try {
      await this.validateUser(token);

      const contributors = await prisma.contributors.findMany({
        orderBy: { createdIn: 'desc' },
        include: { user: true ,documents:true},
      });

      return ContributorsSchemas.contributors.parse(contributors);
    } catch (error) {
      console.error('[VIEW_ALL] Error occurred:', error);
      if (
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException ||
        error instanceof ItemNotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to retrieve contributors');
    }
  }

  public async delete(
    data: z.infer<typeof ContributorsSchemas.deleteContributor>,
    key: z.infer<typeof ContributorsSchemas.token>
  ): Promise<z.infer<typeof this.responseSchema>> {
    const { id } = data;
    const { token } = key;

    try {
      await this.validateUser(token);

      const contributor = await prisma.contributors.findUnique({ where: { id } });
      if (!contributor) {
        throw new ItemNotFoundException('Contributor not found');
      }

      await prisma.contributors.delete({ where: { id } });

      console.log('[DELETE] Contributor deleted:', id);

      return { message: 'Contributor deleted successfully' };
    } catch (error) {
      console.error('[DELETE] Error occurred:', error);
      if (
        error instanceof ItemNotFoundException ||
        error instanceof AuthorizationException ||
        error instanceof InvalidDataException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred when trying to delete contributor');
    }
  }
}

export default ContributorsController;