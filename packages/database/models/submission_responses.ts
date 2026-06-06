import { pgTable, uuid, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core";
import { submissionsTable } from "./submission";
import { formFieldsTable } from "./form-field";

export const submissionResponsesTable = pgTable("submission_responses", {
  id: uuid("id").primaryKey().defaultRandom(),

  submissionId: uuid("submission_id")
    .references(() => submissionsTable.id)
    .notNull(),

  fieldId: uuid("field_id")
    .references(() => formFieldsTable.id)
    .notNull(),

  labelKey: text("label_key")
    .notNull(),

  value: text("value")
    .notNull(),
});