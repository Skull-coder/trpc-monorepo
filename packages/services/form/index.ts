import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import type { CreateFormInput, UpdateFormInput, DeleteFormInput } from "./model";
import { createFormInput, updateFormInput, deleteFormInput } from "./model";

class FormService {
  public async createForm(payload: CreateFormInput, userId: string) {
    const { title, description } = await createFormInput.parseAsync(payload);

    const formInsertResult = await db
      .insert(formsTable)
      .values({
        title,
        description: description || null,
        createdBy: userId,
      })
      .returning({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
      });

    if (!formInsertResult || !formInsertResult[0] || formInsertResult.length === 0) {
      throw new Error("Something went wrong while creating form");
    }

    return formInsertResult[0];
  }

  public async getFormsByUserId(userId: string) {
    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    return forms;
  }

  public async updateForm(payload: UpdateFormInput, userId: string) {
    const { id, title, description } = await updateFormInput.parseAsync(payload);

    // Verify ownership
    const existingForm = await db
      .select({ createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, id));

    if (!existingForm || !existingForm[0] || existingForm[0].createdBy !== userId) {
      throw new Error("Form not found or unauthorized");
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    

    const formUpdateResult = await db
      .update(formsTable)
      .set(updateData)
      .where(eq(formsTable.id, id))
      .returning({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        updatedAt: formsTable.updatedAt,
      });

    if (!formUpdateResult || !formUpdateResult[0] || formUpdateResult.length === 0) {
      throw new Error("Something went wrong while updating form");
    }

    return formUpdateResult[0];
  }

  public async deleteForm(payload: DeleteFormInput, userId: string) {
    const { id } = await deleteFormInput.parseAsync(payload);

    // Verify ownership
    const existingForm = await db
      .select({ createdBy: formsTable.createdBy })
      .from(formsTable)
      .where(eq(formsTable.id, id));

    if (!existingForm || !existingForm[0] || existingForm[0].createdBy !== userId) {
      throw new Error("Form not found or unauthorized");
    }

    await db.delete(formsTable).where(eq(formsTable.id, id));

    return { success: true };
  }
}

export default FormService;
