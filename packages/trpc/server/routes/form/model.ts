import { z } from "zod";

export const CreateFormInputModel = z.object({
  title: z.string().min(1).max(55).describe("title of the form"),
  description: z
    .string()
    .max(300)
    .optional()
    .describe("description of the form"),
});

export const CreateFormOutputModel = z.object({
  id: z.string().describe("id of the created form"),
  title: z.string().describe("title of the form"),
  description: z.string().nullable().describe("description of the form"),
  createdAt: z.date().describe("creation timestamp"),
});

export const GetFormsInputModel = z.undefined();

export const GetFormsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().nullable().describe("description of the form"),
    createdAt: z.date().describe("creation timestamp"),
    updatedAt: z.date().nullable().describe("update timestamp"),
  })
);

export const UpdateFormInputModel = z.object({
  id: z.string().describe("id of the form"),
  title: z.string().min(1).max(55).optional().describe("title of the form"),
  description: z
    .string()
    .max(300)
    .optional()
    .describe("description of the form"),
});

export const UpdateFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
  title: z.string().describe("title of the form"),
  description: z.string().nullable().describe("description of the form"),
  updatedAt: z.date().describe("update timestamp"),
});

export const DeleteFormInputModel = z.object({
  id: z.string().describe("id of the form"),
});

export const DeleteFormOutputModel = z.object({
  success: z.boolean().describe("whether the form was deleted successfully"),
});
