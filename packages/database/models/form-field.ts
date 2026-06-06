import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,
  integer
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type_enum", [
  "TEXT",
  "NUMBER",
  "EMAIL",
  "YES_NO",
  "PASSWORD",
]);

export const formFieldsTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .references(() => formsTable.id).notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  labelKey: varchar("label_key", { length: 100 }).notNull(),
  description: text("description"),
  isRequired: boolean("is_required").default(false).notNull(),
  index: integer("index").notNull(),
  type: fieldTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table)=>{
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index)
    }
});
