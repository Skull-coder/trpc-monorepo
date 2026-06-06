import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().min(1).max(55).describe("title of the form"),
  description: z
    .string()
    .max(300)
    .optional()
    .describe("description of the form"),
});

export const updateFormInput = z.object({
  id: z.string().describe("id of the form"),
  title: z.string().min(1).max(55).optional().describe("title of the form"),
  description: z
    .string()
    .max(300)
    .optional()
    .describe("description of the form"),
});

export const deleteFormInput = z.object({
  id: z.string().describe("id of the form"),
});

export const getFormsInput = z.undefined();

export type CreateFormInput = z.infer<typeof createFormInput>;
export type UpdateFormInput = z.infer<typeof updateFormInput>;
export type DeleteFormInput = z.infer<typeof deleteFormInput>;
export type GetFormsInput = z.infer<typeof getFormsInput>;
