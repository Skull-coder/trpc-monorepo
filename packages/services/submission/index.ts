import { submitFormInput, type SubmitFormInput } from "./model";
import { db, eq } from "@repo/database";
import { submissionsTable } from "@repo/database/models/submission";
import { submissionResponsesTable } from "@repo/database/models/submission_responses";
import { formFieldsTable } from "@repo/database/models/form-field";

class SubmissionService {
  public async submitForm(payload: SubmitFormInput) {
    const { formId, response } = await submitFormInput.parseAsync(payload);

    return db.transaction(async (tx) => {
      const allFields = await tx
        .select({
          id: formFieldsTable.id,
          labelKey: formFieldsTable.labelKey,
          isRequired: formFieldsTable.isRequired,
          type: formFieldsTable.type,
        })
        .from(formFieldsTable)
        .where(eq(formFieldsTable.formId, formId));

      if (allFields.length === 0) {
        throw new Error("Form not found");
      }

      const fieldMap = new Map(
        allFields.map((field) => [field.id, field]),
      );

      const submittedFieldIds = new Set<string>();

      for (const r of response) {
        const field = fieldMap.get(r.fieldId);

        if (!field) {
          throw new Error(
            `Field ${r.fieldId} does not belong to form ${formId}`,
          );
        }

        if (submittedFieldIds.has(r.fieldId)) {
          throw new Error(`Duplicate response for field ${r.fieldId}`);
        }

        submittedFieldIds.add(r.fieldId);

        if (field.labelKey !== r.labelKey) {
          throw new Error(
            `Label key mismatch for field ${r.fieldId}`,
          );
        }

        if (
          field.isRequired &&
          (r.value === null ||
            r.value === undefined ||
            (typeof r.value === "string" &&
              r.value.trim().length === 0))
        ) {
          throw new Error(
            `${field.labelKey} is required`,
          );
        }

        // validateFieldValue(field.type, r.value);
      }

      const missingRequiredFields = allFields
        .filter(
          (field) =>
            field.isRequired &&
            !submittedFieldIds.has(field.id),
        )
        .map((field) => field.labelKey);

      if (missingRequiredFields.length > 0) {
        throw new Error(
          `Missing required fields: ${missingRequiredFields.join(", ")}`,
        );
      }

      const [submission] = await tx
        .insert(submissionsTable)
        .values({
          formId,
        })
        .returning({
          submissionId: submissionsTable.id,
        });

      if (!submission?.submissionId) {
        throw new Error("Failed to create submission");
      }

      await tx.insert(submissionResponsesTable).values(
        response.map((r) => ({
          submissionId: submission.submissionId,
          fieldId: r.fieldId,
          labelKey: r.labelKey,
          value: r.value,
        })),
      );

      return {
        submissionId: submission.submissionId,
      };
    });
  }
}

export default SubmissionService;