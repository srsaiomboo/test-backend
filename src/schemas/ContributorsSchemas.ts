import { z } from 'zod';
import UserSchema from './UsersSchemas';

class ContributorsSchemas {
  static contributor = z.object({
    id: z.number(),
    fullName: z.string().optional(),
    gender: z.string().optional(),
    biNumber: z.string().optional(),
    dateOfBirth: z.date(),
    phoneNumber: z.string().optional(),
    province: z.string().optional(),
    municipality:z.string().optional(),
    neighborhood: z.string().optional(),
    email: z.string().optional(),
    digitalCardLink: z.string().nullable().optional(),
    createdIn: z.date(),
    updatedIn: z.date().nullable(),
    idUser: z.number().optional(),
    status: z.boolean(),
    user: UserSchema.user,
  });

  static registerContributor = z.object({
    fullName: z.string({
      required_error: "The 'fullName' field is required.",
      invalid_type_error: "The 'fullName' field must be a string."
    }).nonempty("Full name cannot be empty").max(100),
    gender: z.string({
      required_error: "The 'gender' field is required.",
      invalid_type_error: "The 'gender' field must be a string."
    }).nonempty("Gender cannot be empty").max(45),
    biNumber: z.string({
      required_error: "The 'biNumber' field is required.",
      invalid_type_error: "The 'biNumber' field must be a string."
    }).nonempty("BI number cannot be empty").max(20),
    dateOfBirth: z.preprocess((val) => {
      if (typeof val === "string" ) {
        return new Date(val);
      }
      return val;
    }, z.date({
      required_error: "The 'dateOfBirth' field is required.",
      invalid_type_error: "The 'dateOfBirth' field must be a date."
    })),
    phoneNumber: z.string({
      required_error: "The 'phoneNumber' field is required.",
      invalid_type_error: "The 'phoneNumber' field must be a string."
    }).nonempty("Phone number cannot be empty").max(255),
    province: z.string({
      required_error: "The 'province' field is required.",
      invalid_type_error: "The 'province' field must be a string."
    }).nonempty("Province cannot be empty").max(45),
    municipality: z.string({
      required_error: "The 'municipality' field is required.",
      invalid_type_error: "The 'municipality' field must be a string."
    }).nonempty("Municipality cannot be empty").max(45),
    neighborhood: z.string({
      required_error: "The 'neighborhood' field is required.",
      invalid_type_error: "The 'neighborhood' field must be a string."
    }).nonempty("Neighborhood cannot be empty").max(45),
    email: z.string({
      required_error: "The 'email' field is required.",
      invalid_type_error: "The 'email' field must be a string."
    }).email("Invalid email format"),
  
  
  });

  static updateContributor = z.object({
    id: z.number({
      required_error: "The 'id' field is required.",
      invalid_type_error: "The 'id' field must be a number."
    }).int().positive("ID must be a positive integer"),
    fullName: z.string().max(100).optional(),
    gender: z.string().max(45).optional(),
    biNumber: z.string().max(20).optional(),
    dateOfBirth: z.string().optional(),
    phoneNumber: z.string().max(255).optional(),
    province: z.string().max(45).optional(),
    municipality: z.string().max(45).optional(),
    neighborhood: z.string().max(45).optional(),
    email: z.string().email("Invalid email format").optional(),
    status: z.string().optional(),
  });

  static deleteContributor = z.object({
    id: z.number({
      required_error: "The 'id' field is required.",
      invalid_type_error: "The 'id' field must be a number."
    }).int().positive("ID must be a positive integer"),
  });

  static token = z.object({
    token: z.string({
      required_error: "The 'token' field is required.",
      invalid_type_error: "The 'token' field must be a string."
    }).nonempty("Token cannot be empty."),
  });

  static successResponse = z.object({
    message: z.string({
      required_error: "The 'message' field is required.",
      invalid_type_error: "The 'message' field must be a string."
    }).nonempty("Message cannot be empty."),
  });

  static contributors = z.array(this.contributor);
}

export default ContributorsSchemas;