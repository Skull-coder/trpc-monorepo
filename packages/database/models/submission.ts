import { pgTable, uuid, varchar, timestamp, boolean, text } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .references(() => formsTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
