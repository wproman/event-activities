/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation */
"use server";

import { UserInfo } from "@/app/types/user.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getCookie } from "./tokenHandlers";

export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return null;
    }

    const verifiedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;

    if (!verifiedToken) {
      return null;
    }

  const userInfo: UserInfo = {
  name: verifiedToken.name ?? "", // ✅ prevent undefined
  email: verifiedToken.email,
  role: verifiedToken.role,
};
console.log("userinfo",userInfo)
    return userInfo;
    
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
