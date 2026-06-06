import { z } from "zod";

export const fieldTypeEnum = z.enum([
  "TEXT",
  "NUMBER",
  "EMAIL",
  "YES_NO",
  "PASSWORD",
]);

export const createFormFieldInput = z.object({
  formId: z.string().describe("id of the form"),
  label: z.string().min(1).max(100).describe("label of the field"),
  description: z
    .string()
    .max(300)
    .optional()
    .describe("description of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  type: fieldTypeEnum.describe("type of the field"),
});

export const getFormFieldsInput = z.object({
  formId: z.string().describe("id of the form"),
});

export const updateFormFieldInput = z.object({
  fieldId: z.string().describe("id of the field to update"),
  label: z.string().min(1).max(100).optional().describe("label of the field"),
  labelKey: z.string().describe("label key generated from label (lowercase, spaces to underscores, trimmed)"),
  description: z
    .string()
    .max(300)
    .optional()
    .describe("description of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  type: fieldTypeEnum.optional().describe("type of the field"),
});

export const deleteFormFieldInput = z.object({
  fieldId: z.string().describe("id of the field to delete"),
});

export const reorderFieldInput = z.object({
  formId: z.string(),
  fieldId: z.string(),
  index: z.number().int().positive(),
});


export type CreateFormFieldInput = z.infer<typeof createFormFieldInput>;
export type GetFormFieldsInput = z.infer<typeof getFormFieldsInput>;
export type UpdateFormFieldInput = z.infer<typeof updateFormFieldInput>;
export type DeleteFormFieldInput = z.infer<typeof deleteFormFieldInput>;
export type ReorderFieldInput = z.infer<typeof reorderFieldInput>;

