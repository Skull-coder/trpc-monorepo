import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { CreateUserWithEmailAndPasswordInputModel, CreateUserWithEmailAndPasswordOutputModel, LoggedInUserInfoInputModel, LoggedInUserInfoOutputModel, SigninUserWithEmailAndPasswordInputModel, SigninUserWithEmailAndPasswordOutputModel } from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi:{
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS
      }
    })
    .input(CreateUserWithEmailAndPasswordInputModel)
    .output(CreateUserWithEmailAndPasswordOutputModel)
    .mutation(async({input, ctx})=>{
      const {fullName, email, password} = input;

      const {id, token} = await userService.createUserWithEmailAndPassword({fullName, email, password})

      setAuthenticationCookie(ctx, token)
      return {
        id
      }
    }),

  signinUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi:{
        method:"POST",
        path: getPath("/signinUserWithEmailAndPassword"),
        tags: TAGS
      }
    })
    .input(SigninUserWithEmailAndPasswordInputModel)
    .output(SigninUserWithEmailAndPasswordOutputModel)
    .mutation(async({input, ctx})=>{
      const {email, password} = input;

      const {id, token} = await userService.signinUserWithEmailAndPassword({email, password})

      setAuthenticationCookie(ctx, token)
      
      return {
        id
      }
    }),

  loggedInUserInfo: authenticatedProcedure
    .meta({
      openapi:{
        method:"GET",
        path: getPath("/LoggedInUserInfo"),
        tags: TAGS,
        protect: true
      }
    })
    .input(LoggedInUserInfoInputModel)
    .output(LoggedInUserInfoOutputModel)
    .query(async({ctx})=>{

      const {id, email, fullName} = await userService.getUserDetailsById(ctx.user.id)

      return {
        id,
        email,
        fullName
      }

    })
});
