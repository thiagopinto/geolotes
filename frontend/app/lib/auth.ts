import { decrypt } from "@/app/lib/crypto";
import Cookies from "js-cookie";
import { getCookies } from "next-client-cookies/server";
import { IAuthResponse, IRole, IUser } from "../interfaces/auth";

export async function getSession(): Promise<IAuthResponse | null> { // Retorna uma Promise
  const cookiesName = process.env.COOKIE_NAME || "next";


  if (typeof window !== "undefined") { // Cliente
    const easycobSession = Cookies.get(cookiesName);
    if (!easycobSession) return null;

    const decryptedSession = decrypt(easycobSession);
    return decryptedSession || null;
  }

  if (typeof global !== "undefined") {
    const cookies = await getCookies();
    if (!cookies) return null;

    const easycobSession = cookies.get(cookiesName);
    if (!easycobSession) return null;

    const decryptedSession = decrypt(easycobSession);
    return decryptedSession || null;
  }

  return null;
}

export async function getAccessToken(): Promise<string | null> {
  const decryptedSession = await getSession();
  return decryptedSession?.accessToken || null;
}

export async function getUser(): Promise<IUser | null> {
  const decryptedSession = await getSession();
  return decryptedSession?.user || null;
}

export async function getRole(): Promise<IRole | number | null> {
  const decryptedSession = await getSession();
  if (!decryptedSession) return null;
  if (!decryptedSession.user.roles) return null;
  return decryptedSession.user.roles[0];
}

export async function isAuth(): Promise<boolean> {
  const decryptedSession = await getSession();
  if (decryptedSession && decryptedSession.user) {
    return true;
  }
  return false;
}

export async function getUserInitials(): Promise<string | null> {
  const user = await getUser();

  if (!user) {
    return null;
  }
  const ignoreWords = ["da", "das", "de", "do", "dos", "e"];

  return user.name
    .split(" ") // Divide o nome por espaços
    .filter((word) => !ignoreWords.includes(word.toLowerCase())) // Ignora palavras específicas
    .map((word) => word[0].toUpperCase()) // Pega a primeira letra de cada palavra e transforma em maiúscula
    .slice(0, 2) // Pega apenas as duas primeiras iniciais
    .join(""); // Junta as iniciais
}

export function isTokenExpiringSoon(authResponse: IAuthResponse, minutesBeforeExpire = 5) {
  try {
    const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
    const expirationTime = authResponse.expiresIn * 1000; // Tempo de expiração do token em segundos

    // Calcula a diferença entre o tempo de expiração e o tempo atual em segundos
    const timeLeft = expirationTime - currentTime;

    // Calcula o tempo que falta para expirar em minutos
    const timeLeftMinutes = Math.floor(timeLeft / 60);

    return timeLeftMinutes <= minutesBeforeExpire;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return true; // Em caso de erro, considera o token como expirando para renovar
  }
}