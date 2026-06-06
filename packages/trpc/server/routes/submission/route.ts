import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { SubmitFormInputModel, SubmitFormOutputModel } from "./model";
import { submissionService } from "../../services";

const TAGS = ["Submissions"];
const getPath = generatePath("/submissions");

export const submissionRouter = router({
  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/{formId}/submitForm"),
        tags: TAGS,
      },
    })
    .input(SubmitFormInputModel)
    .output(SubmitFormOutputModel)
    .mutation(async ({ input }) => {
      const result = await submissionService.submitForm(input);
      return result;
    }),
});