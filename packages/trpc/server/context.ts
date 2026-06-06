import type {CreateExpressContextOptions} from "@trpc/server/adapters/express"
import {createCookieFactory, clearCookieFactory, getCookieFactory} from "./utils/cookie"

export interface TRPCCtxUser{
    id: string
}

export interface TRPCCOntext{
    getCookie: ReturnType<typeof getCookieFactory>,
    createCookie: ReturnType<typeof createCookieFactory>,
    clearCookie: ReturnType<typeof clearCookieFactory>
    user? : TRPCCtxUser
}

export async function createContext({req, res}:CreateExpressContextOptions): Promise<TRPCCOntext>{

    const ctx: TRPCCOntext ={
        getCookie: getCookieFactory(req),
        createCookie: createCookieFactory(res),
        clearCookie: clearCookieFactory(res),
        user: undefined
    }
    
    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
