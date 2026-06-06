import { authenticatedProcedure, router } from "../../trpc";
import {
  CreateFormFieldInputModel,
  CreateFormFieldOutputModel,
  GetFormFieldsInputModel,
  GetFormFieldsOutputModel,
  UpdateFormFieldInputModel,
  UpdateFormFieldOutputModel,
  DeleteFormFieldInputModel,
  DeleteFormFieldOutputModel,
  ReorderFieldInputModel,
  ReorderFieldOutputModel,
} from "./model";
import { formFieldService } from "../../services";

const TAGS = ["Form Fields"];

export const formFieldRouter = router({
  createFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/forms/{formId}/fields",
        tags: TAGS,
        protect: true,
      },
    })
    .input(CreateFormFieldInputModel)
    .output(CreateFormFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { formId, ...fieldData } = input;
      const field = await formFieldService.createFormField(
        { ...fieldData, formId },
        ctx.user.id
      );
      return field;
    }),

  getFormFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/forms/{formId}/fields",
        tags: TAGS,
        protect: true,
      },
    })
    .input(GetFormFieldsInputModel)
    .output(GetFormFieldsOutputModel)
    .query(async ({ input, ctx }) => {
      const fields = await formFieldService.getFormFieldsByFormId(
        input.formId,
        ctx.user.id
      );
      return fields;
    }),

  updateFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/fields/{fieldId}",
        tags: TAGS,
        protect: true,
      },
    })
    .input(UpdateFormFieldInputModel)
    .output(UpdateFormFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const field = await formFieldService.updateFormField(input, ctx.user.id);
      return field;
    }),

  deleteFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/fields/{fieldId}",
        tags: TAGS,
        protect: true,
      },
    })
    .input(DeleteFormFieldInputModel)
    .output(DeleteFormFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const result = await formFieldService.deleteFormField(input, ctx.user.id);
      return result;
    }),

  reorderFormFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/forms/{formId}/fields/reorder",
        tags: TAGS,
        protect: true,
      },
    })
    .input(ReorderFieldInputModel)
    .output(ReorderFieldOutputModel)
    .mutation(async ({ input, ctx }) => {
      const reorderedFields = await formFieldService.reorderFormField(
        input,
        ctx.user.id
      );
      return reorderedFields;
    }),
});
