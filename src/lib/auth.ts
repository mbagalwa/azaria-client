import { cookies } from "next/headers";
import { apiFetch, type ApiUser } from "@/lib/api";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/constants";

const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

export async function setToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
}

export async function clearToken(): Promise<void> {
  const store = await cookies();
  store.delete(CUSTOMER_TOKEN_COOKIE);
}

/** Client connecté (token validé auprès de l'API), sinon null. */
export async function getCurrentCustomer(): Promise<ApiUser | null> {
  const token = await getToken();
  if (!token) return null;

  const res = await apiFetch<ApiUser>("/api/v1/account/profile", { token });
  return res.ok ? res.data : null;
}
