import { z } from "zod";

export const SubmitFormInputModel = z.object({
  formId: z.string().describe("id of the form — comes from URL path param"),
  response: z
    .array(
      z.object({
        fieldId: z.string().describe("id of the field to submit"),
        labelKey: z.string().describe("label key for identifying field"),
        value: z.string().describe("value of field"),
      })
    )
    .describe("array of field responses"),
});

export const SubmitFormOutputModel = z.object({
  submissionId: z.string().describe("id of the created submission"),
});

export type SubmitFormInput = z.infer<typeof SubmitFormInputModel>;
export type SubmitFormOutput = z.infer<typeof SubmitFormOutputModel>;   