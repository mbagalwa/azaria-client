"use server";

import { redirect } from "next/navigation";
import { apiFetch, type ApiUser } from "@/lib/api";
import { clearToken, getToken, setToken } from "@/lib/auth";
import { createOrder, type CreateOrderPayload } from "@/lib/orders";

type AuthPayload = { user: ApiUser; token: string };

export type AuthState = {
  error?: string;
  values?: { phone?: string; fullName?: string };
};

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!phone || !password) {
    return { error: "Numéro WhatsApp et mot de passe requis.", values: { phone } };
  }

  const res = await apiFetch<AuthPayload>("/api/v1/auth/customer/login", {
    method: "POST",
    body: { phone, password },
  });
  if (!res.ok) return { error: res.message, values: { phone } };

  await setToken(res.data.token);
  redirect("/app");
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("passwordConfirmation") ?? "");
  const values = { fullName, phone };

  if (fullName.length < 2) return { error: "Indiquez votre nom complet.", values };
  if (!phone) return { error: "Indiquez votre numéro WhatsApp.", values };
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères.", values };
  }
  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas.", values };
  }

  const res = await apiFetch<AuthPayload>("/api/v1/auth/customer/signup", {
    method: "POST",
    body: { fullName, phone, password },
  });
  if (!res.ok) return { error: res.message, values };

  await setToken(res.data.token);
  redirect("/app");
}

export async function logoutAction() {
  const token = await getToken();
  if (token) {
    await apiFetch("/api/v1/account/logout", { method: "POST", token });
  }
  await clearToken();
  redirect("/app/connexion");
}

export async function createOrderAction(
  payload: CreateOrderPayload,
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const token = await getToken();
  if (!token) redirect("/app/connexion");

  const res = await createOrder(payload, token);
  if (!res.ok) {
    // Session expirée pendant la composition : on nettoie et on renvoie se connecter.
    if (res.status === 401) {
      await clearToken();
      redirect("/app/connexion");
    }
    return { ok: false, error: res.message };
  }
  return { ok: true, id: res.data.id };
}
