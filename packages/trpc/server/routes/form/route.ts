import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  CreateFormInputModel,
  CreateFormOutputModel,
  GetFormsInputModel,
  GetFormsOutputModel,
  UpdateFormInputModel,
  UpdateFormOutputModel,
  DeleteFormInputModel,
  DeleteFormOutputModel,
} from "./model";
import { formService } from "../../services";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(CreateFormInputModel)
    .output(CreateFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const form = await formService.createForm(input, ctx.user.id);
      return form;
    }),

  getForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(GetFormsInputModel)
    .output(GetFormsOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.getFormsByUserId(ctx.user.id);
      return forms;
    }),

  updateForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/updateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(UpdateFormInputModel)
    .output(UpdateFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const form = await formService.updateForm(input, ctx.user.id);
      return form;
    }),

  deleteForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(DeleteFormInputModel)
    .output(DeleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const result = await formService.deleteForm(input, ctx.user.id);
      return result;
    }),
});
