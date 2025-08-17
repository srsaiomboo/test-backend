import { z } from "zod";

class DocumentsSchemas {
  static document = z.object({
    id: z.number({
      required_error: "The 'id' field is required.",
      invalid_type_error: "The 'id' field must be a number."
    }).int(),
    description: z.string({
      required_error: "The 'description' field is required.",
      invalid_type_error: "The 'description' field must be a string."
    }).max(105),
    fileUrl: z.string({
      required_error: "The 'fileUrl' field is required.",
      invalid_type_error: "The 'fileUrl' field must be a string."
    }),
    typeDocument: z.number({
      required_error: "The 'typeDocument' field is required.",
      invalid_type_error: "The 'typeDocument' field must be a number."
    }).int(),
    name: z.string({
      required_error: "The 'name' field is required.",
      invalid_type_error: "The 'name' field must be a string."
    }).max(105),
    createdIn: z.date({
      required_error: "The 'createdIn' field is required.",
      invalid_type_error: "The 'createdIn' field must be a date."
    }),
    updatedIn: z.date({
      invalid_type_error: "The 'updatedIn' field must be a date."
    }).nullable().optional(),
    idContributor: z.number({
      required_error: "The 'idContributor' field is required.",
      invalid_type_error: "The 'idContributor' field must be a number."
    }).int(),
    status: z.boolean({
      required_error: "The 'status' field is required.",
      invalid_type_error: "The 'status' field must be a boolean."
    }),
  });

  static registerDocument = z.object({
    description: z.string({
      required_error: "The 'description' field is required.",
      invalid_type_error: "The 'description' field must be a string."
    }).nonempty("Description cannot be empty.").max(105),
    typeDocument: z.string({
      required_error: "The 'typeDocument' field is required.",
      invalid_type_error: "The 'typeDocument' field must be a string."
    }).nonempty("Type document cannot be empty."),
    name: z.string({
      required_error: "The 'name' field is required.",
      invalid_type_error: "The 'name' field must be a string."
    }).nonempty("Name cannot be empty.").max(105),
    file: z.any({
      invalid_type_error: "The 'file' field must be a valid file."
    }).optional(),
  }).nullable();

  static updateDocument = z.object({
    id: z.string({
      required_error: "The 'id' field is required.",
      invalid_type_error: "The 'id' field must be a string."
    }).nonempty("Document ID cannot be empty."),
    description: z.string({
      required_error: "The 'description' field is required.",
      invalid_type_error: "The 'description' field must be a string."
    }).nonempty("Description cannot be empty.").max(105),
    typeDocument: z.string({
      required_error: "The 'typeDocument' field is required.",
      invalid_type_error: "The 'typeDocument' field must be a string."
    }).nonempty("Type document cannot be empty."),
    name: z.string({
      required_error: "The 'name' field is required.",
      invalid_type_error: "The 'name' field must be a string."
    }).nonempty("Name cannot be empty.").max(105),
    status: z.string({
      required_error: "The 'status' field is required.",
      invalid_type_error: "The 'status' field must be a string."
    }).nonempty("Status cannot be empty."),
    idContributor: z.string({
      required_error: "The 'idContributor' field is required.",
      invalid_type_error: "The 'idContributor' field must be a string."
    }).nonempty("Contributor ID cannot be empty."),
    file: z.any({
      invalid_type_error: "The 'file' field must be a valid file."
    }).optional(),
  }).nullable();

  static deleteDocument = z.object({
    id: z.number({
      required_error: "The 'id' field is required.",
      invalid_type_error: "The 'id' field must be a number."
    }).int().positive("ID must be a positive integer"),
  });

  static viewDocument = z.object({
    id: z.string({
      required_error: "The 'id' field is required.",
      invalid_type_error: "The 'id' field must be a string."
    }).nonempty("Document ID cannot be empty."),
  });

  static viewAllDocuments = z.object({});

  static uploadFileDocument = z.object({
    id: z.string({
      required_error: "The 'id' field is required.",
      invalid_type_error: "The 'id' field must be a string."
    }).nonempty("Document ID cannot be empty."),
    file: z.any({
      invalid_type_error: "The 'file' field must be a valid file."
    }).optional(),
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

  static documentList = z.array(this.document);
}

export default DocumentsSchemas;