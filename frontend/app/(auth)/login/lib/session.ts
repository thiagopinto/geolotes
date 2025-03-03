"use server";
//import "server-only";
import { redirect } from "next/navigation";
import { decrypt, encrypt } from "@/app/lib/crypto";
import { getCookies } from "next-client-cookies/server";
import * as dotEnv from "dotenv";
import { jwtDecode } from "jwt-decode";

dotEnv.config();

export async function createSession(token: string) {
  const cookiesName = process.env.COOKIE_NAME || "next";
  const cookies = await getCookies();

  const decodedToken = jwtDecode(token);
  const expiresIn = decodedToken.exp as number;

  console.log(decodedToken);

  if (!expiresIn) {
    redirect("/login");
    return;
  }
  const expirationDate = new Date(expiresIn * 1000);
  const encryptedToken = encrypt(decodedToken);

  cookies.set(cookiesName, encryptedToken, {
    expires: expirationDate,
    path: "/",
  });
}

export async function updateSession() {
  const cookiesName = process.env.COOKIE_NAME || "next";
  const cookies = await getCookies();
  const session = cookies.get(cookiesName);

  if (!session) {
    redirect("/login");
    return;
  }

  try {
    const decryptedToken = decrypt(session);

    const token = await refresh(decryptedToken); // Passa o objeto com token, user e expiresIn para refresh

    if (!token) {
      redirect("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const expiresIn = decodedToken.exp as number;

    if (!expiresIn) {
      redirect("/login");
      return;
    }

    const expirationDate = new Date(expiresIn * 1000);

    const encryptedToken = encrypt(decodedToken);

    cookies.set(cookiesName, encryptedToken, {
      expires: expirationDate,
      path: "/",
    });
    return { cookiesName, encryptedToken, expirationDate };
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error);
    redirect("/login");
  }
}

export async function refresh(token: string) {
  const url = process.env.API_URL ? process.env.API_URL : "next";
  const response = await fetch(`${url}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Verifica se a resposta está ok (status 200-299)
  if (!response.ok) {
    redirect("/login");
  }

  const payload = await response.text();
  return payload;
}

export async function deleteSession() {
  const cookiesName = process.env.COOKIE_NAME
    ? process.env.COOKIE_NAME
    : "next";

  const cookies = await getCookies();
  cookies.remove(cookiesName);
}
