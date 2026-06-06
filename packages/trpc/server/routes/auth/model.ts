import {z} from "zod"

export const CreateUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("full name of user"),
    email: z.email().describe("email of user"),
    password: z.string().describe("password of user")
})
export const CreateUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of newly created user")
})

export const SigninUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("email of user"),
    password: z.string().describe("password of user")
})
export const SigninUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of newly created user")
})
export const LoggedInUserInfoInputModel = z.undefined()

export const LoggedInUserInfoOutputModel = z.object({
    id: z.string().describe("id of newly created user"),
    fullName: z.string().describe("full name of user"),
    email: z.email().describe("email of user")
})