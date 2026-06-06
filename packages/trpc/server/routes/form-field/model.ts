import { z } from "zod";

export const fieldTypeEnumModel = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

export const CreateFormFieldInputModel = z.object({
  formId: z.string().describe("id of the form (from URL params /forms/{formId}/fields)"),
  label: z.string().min(1).max(100).describe("label of the field"),
  description: z.string().max(300).optional().describe("description of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  type: fieldTypeEnumModel.describe("type of the field"),
});

export const CreateFormFieldOutputModel = z.object({
  id: z.string().describe("id of the created field"),
  formId: z.string().describe("id of the form"),
  label: z.string().describe("label of the field"),
  labelKey: z.string().describe("generated key from label"),
  description: z.string().nullable().describe("description of the field"),
  isRequired: z.boolean().describe("whether the field is required"),
  index: z.number().describe("position index of the field"),
  type: fieldTypeEnumModel.describe("type of the field"),
  createdAt: z.date().describe("creation timestamp"),
});

export const GetFormFieldsInputModel = z.object({
  formId: z.string().describe("id of the form (from URL params /forms/{formId}/fields)"),
});

export const GetFormFieldsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the field"),
    formId: z.string().describe("id of the form"),
    label: z.string().describe("label of the field"),
    labelKey: z.string().describe("generated key from label"),
    description: z.string().nullable().describe("description of the field"),
    isRequired: z.boolean().describe("whether the field is required"),
    index: z.number().describe("position index of the field"),
    type: fieldTypeEnumModel.describe("type of the field"),
    createdAt: z.date().describe("creation timestamp"),
    updatedAt: z.date().nullable().describe("update timestamp"),
  }),
);

export const UpdateFormFieldInputModel = z.object({
  fieldId: z.string().describe("id of the field to update (from URL params)"),
  label: z.string().min(1).max(100).optional().describe("label of the field"),
  labelKey: z
    .string()
    .describe("label key generated from label (lowercase, spaces to underscores, trimmed)"),
  description: z.string().max(300).optional().describe("description of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  type: fieldTypeEnumModel.optional().describe("type of the field"),
});

export const UpdateFormFieldOutputModel = z.object({
  fieldId: z.string().describe("id of the field"),
  formId: z.string().describe("id of the form"),
  label: z.string().describe("label of the field"),
  labelKey: z.string().describe("generated key from label"),
  description: z.string().nullable().describe("description of the field"),
  isRequired: z.boolean().describe("whether the field is required"),
  index: z.number().describe("position index of the field"),
  type: fieldTypeEnumModel.describe("type of the field"),
  updatedAt: z.date().describe("update timestamp"),
});

export const DeleteFormFieldInputModel = z.object({
  fieldId: z.string().describe("id of the field to delete (from URL params)"),
});

export const DeleteFormFieldOutputModel = z.object({
  success: z.boolean().describe("whether the field was deleted successfully"),
});

export const ReorderFieldInputModel = z.object({
  formId: z.string().describe("id of the form"),

  fieldId: z.string().describe("id of the field being moved"),

  index: z.number().int().positive().describe("new order index for the field"),
});

export const ReorderFieldOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the field"),
    formId: z.string().describe("id of the form"),
    label: z.string().describe("label of the field"),
    labelKey: z.string().describe("generated key from label"),
    description: z.string().nullable().describe("description of the field"),
    isRequired: z.boolean().describe("whether the field is required"),
    index: z.number().describe("position index of the field"),
    type: fieldTypeEnumModel.describe("type of the field"),
    createdAt: z.date().describe("creation timestamp"),
    updatedAt: z.date().nullable().describe("update timestamp"),
  }),
);
