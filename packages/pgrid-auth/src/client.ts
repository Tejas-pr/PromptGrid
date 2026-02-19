import { createAuthClient } from "better-auth/react"

const BASE_URL = import.meta.env.VITE_BETTER_AUTH_URL

export const authClient = createAuthClient({
    baseURL: BASE_URL
})

// https://www.better-auth.com/docs/installation - check this docs
export const { signIn, signUp, useSession, signOut } = authClient;