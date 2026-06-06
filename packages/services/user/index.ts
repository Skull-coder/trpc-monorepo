import type { JwtPayload } from "./model";
import {
  type CreateUserWithEmailAndPasswordInput,
  type SignInUserWithEmailAndPasswordInput,
  createUserWithEmailAndPasswordInput,
  signInUserWithEmailAndPasswordInput
} from "./model";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import argon2 from "argon2";
import { jwtVerify, SignJWT } from "jose";
import { env } from "../env";

class UserService {
  private JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async hash(value: string) {
    return await argon2.hash(value);
  }

  private async compareHash(value: string, hashedValue: string){
    return await argon2.verify(hashedValue, value)
  }

  private async verifyJwtToken(token: string): Promise<JwtPayload> {
    const result =  await jwtVerify<JwtPayload>(token, this.JWT_SECRET);
    return result.payload
  }

  public async getUserDetailsById(userId: string){
    const user =  await db.select({
      id: usersTable.id,
      email: usersTable.email,
      fullName: usersTable.fullName
    }).from(usersTable).where(eq(usersTable.id, userId))

    if(!user || !user[0] || user.length === 0) throw new Error("User with id:"+userId+" does not exists");

    return user[0]

  }

  private async signJwtToken(userId: string,exp: string = "15m"): Promise<string> {
  const payload: JwtPayload = {
    userId,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(this.JWT_SECRET);
}

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInput) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserWithEmail = await this.getUserByEmail(email);

    if (existingUserWithEmail) {
      throw new Error(`user with email ${email} already exists`);
    }

    const hashedPassword = await this.hash(password);

    const userInsertResult = await db
      .insert(usersTable)
      .values({ fullName, email, hashedPassword })
      .returning({
        id: usersTable.id,
      });

    if (!userInsertResult || !userInsertResult[0] || userInsertResult.length === 0) {
      throw new Error("Something went wrong while creating user");
    }

    const id =  userInsertResult[0].id

    const token = await this.signJwtToken(id);


    return {
      id,
      token
    };
  }

  public async signinUserWithEmailAndPassword(payload:SignInUserWithEmailAndPasswordInput){
    const { email, password } =
      await signInUserWithEmailAndPasswordInput.parseAsync(payload);

      const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error(`user with email ${email} does not exists`);
    }

    if(!user.hashedPassword){
      throw new Error("Do OAuth Login")
    }

    const isMatch = await this.compareHash(password, user.hashedPassword)

    const id = user.id

    const token = await this.signJwtToken(id);

    return {
      id,
      token
    };
    
  }

  public async verifyAndDecodeUserToken(token: string){
    
    try {     
      const result = await this.verifyJwtToken(token)
      const id = result.userId
      
      return {
        id
      }
    
    } catch (error) {
        throw new Error("Invalid token") 
    }
    
  }
}

export default UserService;
