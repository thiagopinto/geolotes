"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpiringSoon, getSession } from "@/app/lib/auth";
import Cookies from "js-cookie";
import { updateSession } from "../login/lib/session";

 const useRefreshAccessToken = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const session = await getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      if (isTokenExpiringSoon(session)) {
        // TODO: Implementar lógica para atualizar o token
        console.log("Token expirando em breve. Atualize o token aqui.");

        // Estado da requisição (isPending indica se está carregando)
        const newSession = await updateSession();

        if (newSession) {
          Cookies.set(newSession.cookiesName, newSession.encryptedToken, {
            expires: new Date(newSession.expirationDate),
            path: "/",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar o token:", error);
      // Redirecionar para a página de login ou exibir uma mensagem de erro
      router.push("/login");
    } finally {
      setIsRefreshing(false);
    }
  }, [router]);

  useEffect(() => {

    const checkToken = async () => {
      const session = await getSession();
      if (session) {
        if (isTokenExpiringSoon(session)) {
          refresh();
        }
      }
    };

    checkToken();

    const intervalId = setInterval(checkToken, 60 * 1000); // Verifica a cada minuto

    return () => {
      clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    };
  }, [refresh]);

  return { isRefreshing, refresh };
};

export default useRefreshAccessToken;