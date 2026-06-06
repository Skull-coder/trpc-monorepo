import type {CookieOptions, Response, Request} from "express"
import { TRPCCOntext } from "../context";

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;

const defaultCookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: ONE_YEAR
}

const AUTH_COOKIE_NAME = "authentication-token"

export const createCookieFactory = (res: Response)=>{
    return function createCookie(
        name: string,
        value: string,
        opts: CookieOptions = defaultCookieOptions
    ){
        res.cookie(name, value, opts)
    }
}
export const getCookieFactory = (req: Request)=>{
    return function getCookie(
        name: string,
    ){
        return req.cookies?.[name]
    }
}

export const clearCookieFactory = (res: Response)=>{
    return function clearCookie(
        name: string,
    ){
        res.clearCookie(name)
    }
}

export const setAuthenticationCookie = (ctx: TRPCCOntext, token: string)=>{
    ctx.createCookie(AUTH_COOKIE_NAME, token)
}

export const getAuthenticationCookie = (ctx: TRPCCOntext)=>{
    return ctx.getCookie(AUTH_COOKIE_NAME)
}

export const clearAuthenticationCookie = (ctx: TRPCCOntext)=>{
    ctx.clearCookie(AUTH_COOKIE_NAME)
}