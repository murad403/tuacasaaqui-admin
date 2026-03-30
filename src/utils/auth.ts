"use server"
import { cookies } from "next/headers"

export const saveTokens = async(accessToken: string, refreshToken: string) =>{
    (await cookies()).set("accessToken", accessToken);
    (await cookies()).set("refreshToken", refreshToken);
}

export const clearTokens = async() =>{
    (await cookies()).delete("accessToken");
    (await cookies()).delete("refreshToken");
}

export const getCurrentUser = async() =>{
    const accessToken = (await cookies()).get("accessToken")?.value || undefined;
    const refreshToken = (await cookies()).get("refreshToken")?.value || undefined;
    return {accessToken, refreshToken};
}