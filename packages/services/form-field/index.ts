import { db, eq, max, and } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formsTable } from "@repo/database/models/form";
import type {
  CreateFormFieldInput,
  UpdateFormFieldInput,
  DeleteFormFieldInput,
  ReorderFieldInput,
} from "./model";
import {
  createFormFieldInput,
  updateFormFieldInput,
  deleteFormFieldInput,
  reorderFieldInput,
} from "./model";

class FormFieldService {
  private generateLabelKey(label: string): string {
    return label.toLowerCase().replace(/ /g, "_").trim();
  }

  private async generateIndex(formId: string): Promise<number> {
    const result = await db
      .select({ maxIndex: max(formFieldsTable.index) })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    const currentMaxIndex = result[0]?.maxIndex;

    if (!currentMaxIndex || currentMaxIndex === null) {
      return 1000;
    }

    return Number(currentMaxIndex) + 1000;
  }

  public async createFormField(payload: CreateFormFieldInput, userId: string) {
    const { formId, label, description, isRequired, type } =
      await createFormFieldInput.parseAsync(payload);

    // Verify form ownership
    const form = await db
      .select({ createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form || !form[0] || form[0].createdBy !== userId) {
      throw new Error("Form not found or unauthorized");
    }

    const labelKey = this.generateLabelKey(label);
    const index = await this.generateIndex(formId);

    const fieldInsertResult = await db
      .insert(formFieldsTable)
      .values({
        formId,
        label,
        labelKey,
        description: description || null,
        isRequired: isRequired || false,
        index,
        type,
      })
      .returning({
        id: formFieldsTable.id,
        formId: formFieldsTable.formId,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        createdAt: formFieldsTable.createdAt,
      });

    if (!fieldInsertResult || !fieldInsertResult[0] || fieldInsertResult.length === 0) {
      throw new Error("Something went wrong while creating form field");
    }

    return fieldInsertResult[0];
  }

  public async getFormFieldsByFormId(formId: string, userId: string) {
    // Verify form ownership
    const form = await db
      .select({ createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!form || !form[0] || form[0].createdBy !== userId) {
      throw new Error("Form not found or unauthorized");
    }

    const fields = await db
      .select({
        id: formFieldsTable.id,
        formId: formFieldsTable.formId,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        createdAt: formFieldsTable.createdAt,
        updatedAt: formFieldsTable.updatedAt,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    console.log(fields);
    return fields;
  }

  public async updateFormField(payload: UpdateFormFieldInput, userId: string) {
    const { fieldId, label, labelKey, description, isRequired, type } =
      await updateFormFieldInput.parseAsync(payload);

    // Get the field to verify it exists and check form ownership
    const field = await db
      .select({
        formId: formFieldsTable.formId,
        labelKey: formFieldsTable.labelKey,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, fieldId));

    if (!field || !field[0]) {
      throw new Error("Field not found");
    }

    // Verify form ownership
    const form = await db
      .select({ createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, field[0].formId));

    if (!form || !form[0] || form[0].createdBy !== userId) {
      throw new Error("Unauthorized");
    }

    if (labelKey !== field[0].labelKey) {
      throw new Error("Invalid Input Field");
    }

    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (description !== undefined) updateData.description = description;
    if (isRequired !== undefined) updateData.isRequired = isRequired;
    if (type !== undefined) updateData.type = type;

    const fieldUpdateResult = await db
      .update(formFieldsTable)
      .set(updateData)
      .where(eq(formFieldsTable.id, fieldId))
      .returning({
        fieldId: formFieldsTable.id,
        formId: formFieldsTable.formId,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        updatedAt: formFieldsTable.updatedAt,
      });

    if (!fieldUpdateResult || !fieldUpdateResult[0] || fieldUpdateResult.length === 0) {
      throw new Error("Something went wrong while updating form field");
    }

    return fieldUpdateResult[0];
  }

  public async deleteFormField(payload: DeleteFormFieldInput, userId: string) {
    const { fieldId } = await deleteFormFieldInput.parseAsync(payload);

    // Get the field to verify it exists and check form ownership
    const field = await db
      .select({
        formId: formFieldsTable.formId,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, fieldId));

    if (!field || !field[0]) {
      throw new Error("Field not found");
    }

    // Verify form ownership
    const form = await db
      .select({ createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, field[0].formId));

    if (!form || !form[0] || form[0].createdBy !== userId) {
      throw new Error("Unauthorized");
    }

    await db.delete(formFieldsTable).where(eq(formFieldsTable.id, fieldId));

    return { success: true };
  }

  public async reorderFormField(payload: ReorderFieldInput, userId: string) {
    const { formId, fieldId, index } = await reorderFieldInput.parseAsync(payload);

    // Verify form ownership
    const form = await db
      .select({
        createdBy: formsTable.createdBy,
      })
      .from(formsTable)
      .where(eq(formsTable.id, formId))
      .limit(1);

    if (!form[0] || form[0].createdBy !== userId) {
      throw new Error("Form not found or unauthorized");
    }

    // Verify field belongs to this form
    const field = await db
      .select({
        id: formFieldsTable.id,
      })
      .from(formFieldsTable)
      .where(and(eq(formFieldsTable.id, fieldId), eq(formFieldsTable.formId, formId)))
      .limit(1);

    if (!field[0]) {
      throw new Error("Field not found");
    }

    // Update only the moved field
    await db
      .update(formFieldsTable)
      .set({
        index,
      })
      .where(eq(formFieldsTable.id, fieldId));

    return await db
      .select({
        id: formFieldsTable.id,
        formId: formFieldsTable.formId,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        description: formFieldsTable.description,
        isRequired: formFieldsTable.isRequired,
        index: formFieldsTable.index,
        type: formFieldsTable.type,
        createdAt: formFieldsTable.createdAt,
        updatedAt: formFieldsTable.updatedAt,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(formFieldsTable.index);
  }
}
export default FormFieldService;
