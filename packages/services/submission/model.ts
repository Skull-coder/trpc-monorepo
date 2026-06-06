import {z} from "zod"

export const submitFormInput = z.object({
    formId: z.string().describe("id of the form"),
    response: z.array(z.object({
        fieldId: z.string().describe("id of the field to submit"),
        labelKey: z.string().describe("label key for identifying field"),
        value: z.string().describe("value of field")
    }))
})

export type SubmitFormInput = z.infer<typeof submitFormInput>