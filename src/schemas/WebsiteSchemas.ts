import { z } from "zod";

class WebsiteSchemas {
  static website = z.object({
    idWebSite: z.number({
      required_error: "The 'idWebSite' field is required.",
      invalid_type_error: "The 'idWebSite' field must be a number."
    }).int(),
    title: z.string({
      required_error: "The 'title' field is required.",
      invalid_type_error: "The 'title' field must be a string."
    }).max(255),
    subtitle: z.string({
      required_error: "The 'subtitle' field is required.",
      invalid_type_error: "The 'subtitle' field must be a string."
    }).max(255),
    telephone: z.string({
      required_error: "The 'telephone' field is required.",
      invalid_type_error: "The 'telephone' field must be a string."
    }).max(20),
    email: z.string({
      required_error: "The 'email' field is required.",
      invalid_type_error: "The 'email' field must be a string."
    }).email().max(255),
    photo: z.string({
      invalid_type_error: "The 'photo' field must be a string."
    }).nullable().optional().nullable(),
    footerBackground: z.string({
      required_error: "The 'footerBackground' field is required.",
      invalid_type_error: "The 'footerBackground' field must be a string."
    }).max(50).nullable(),
    headerBackground: z.string({
      required_error: "The 'headerBackground' field is required.",
      invalid_type_error: "The 'headerBackground' field must be a string."
    }).max(50).nullable(),
    createdIn: z.date({
      required_error: "The 'createdIn' field is required.",
      invalid_type_error: "The 'createdIn' field must be a date."
    }).nullable(),
    updatedIn: z.date({
      invalid_type_error: "The 'updatedIn' field must be a date."
    }).nullable().optional(),
  });

  static registerWebsite = z.object({
    title: z.string({
      required_error: "The 'title' field is required.",
      invalid_type_error: "The 'title' field must be a string."
    }).nonempty("Title cannot be empty.").max(255),
    subtitle: z.string({
      required_error: "The 'subtitle' field is required.",
      invalid_type_error: "The 'subtitle' field must be a string."
    }).nonempty("Subtitle cannot be empty.").max(255),
    telephone: z.string({
      required_error: "The 'telephone' field is required.",
      invalid_type_error: "The 'telephone' field must be a string."
    }).nonempty("Telephone cannot be empty.").max(20),
    email: z.string({
      required_error: "The 'email' field is required.",
      invalid_type_error: "The 'email' field must be a string."
    }).nonempty("Email cannot be empty.").email().max(255),
    footerBackground: z.string({
      required_error: "The 'footerBackground' field is required.",
      invalid_type_error: "The 'footerBackground' field must be a string."
    }).nonempty("Footer background cannot be empty.").max(50),
    headerBackground: z.string({
      required_error: "The 'headerBackground' field is required.",
      invalid_type_error: "The 'headerBackground' field must be a string."
    }).nonempty("Header background cannot be empty.").max(50),
  }).nullable();

  static updateWebsite = z.object({
    title: z.string({
      required_error: "The 'title' field is required.",
      invalid_type_error: "The 'title' field must be a string."
    }).nonempty("Title cannot be empty.").optional(),
    subtitle: z.string({
      required_error: "The 'subtitle' field is required.",
      invalid_type_error: "The 'subtitle' field must be a string."
    }).nonempty("Subtitle cannot be empty.").optional(),
    telephone: z.string({
      required_error: "The 'telephone' field is required.",
      invalid_type_error: "The 'telephone' field must be a string."
    }).nonempty("Telephone cannot be empty.").optional(),
    email: z.string({
      required_error: "The 'email' field is required.",
      invalid_type_error: "The 'email' field must be a string."
    }).nonempty("Email cannot be empty.").email().max(255).optional()
  }).optional()

  static deleteWebsite = z.object({
    idWebSite: z.number({
      required_error: "The 'idWebSite' field is required.",
      invalid_type_error: "The 'idWebSite' field must be a number."
    }).int().positive("ID Website must be a positive integer"),
  });

  static viewWebsite = z.object({
    idWebSite: z.string({
      required_error: "The 'idWebSite' field is required.",
      invalid_type_error: "The 'idWebSite' field must be a string."
    }).nonempty("Website ID cannot be empty."),
  });

  static uploadLogoWebsite = z.object({
    idWebSite: z.string({
      required_error: "The 'idWebSite' field is required.",
      invalid_type_error: "The 'idWebSite' field must be a string."
    }).nonempty("Website ID cannot be empty."),
    file: z.any({
      invalid_type_error: "The 'file' field must be a valid file."
    }).optional(),
  });

  static uploadFooterBackgroundWebsite = z.object({
    
    file: z.any({
      invalid_type_error: "The 'file' field must be a valid file."
    }).optional(),
  });

  static uploadHeaderBackgroundWebsite = z.object({
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

  static websiteList = z.array(this.website);
}

export default WebsiteSchemas;