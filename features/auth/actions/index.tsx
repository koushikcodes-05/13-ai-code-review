"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { DEFAULT_AUTH_CALLBACK, SIGN_IN_PATH, getSafeCallbackPath } from "../utils"

export async function signInWithGithub(formData: FormData) {
    const callback = formData.get("callbackUrl")

    const redirectTo = getSafeCallbackPath(
        typeof callback === "string" ? callback : null
    ) 

    const result = await auth.api.signInSocial({
        body: {
            provider: "github",
            callbackURL: "/dashboard"
        },
        headers: await headers()
    })
    if(result.url){
        redirect(result.url)
    }
}

export async function getServerSession(){
    return auth.api.getSession({
        headers: await headers()
    })
}

export async function requireAuth(reditectTo = SIGN_IN_PATH) {
    const session = await getServerSession()
    if(!session) redirect(reditectTo)
    return session
}
export async function requireUnauth(reditectTo = DEFAULT_AUTH_CALLBACK) {
    const session = await getServerSession()
    if(session) redirect(reditectTo)
    return session
}