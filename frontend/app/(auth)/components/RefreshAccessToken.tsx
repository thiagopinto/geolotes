"use client"; // Diretiva para garantir que o componente rode apenas no client

import { useEffect } from "react";
import useRefreshAccessToken from "../hooks/useRefreshAccessToken"; // Importe seu hook

export default function RefreshAccessToken() {
  //const { isRefreshing, refresh } = useRefreshAccessToken();
  useRefreshAccessToken()
  useEffect(() => {
    // Este useEffect garante que o código dentro dele (que usa o hook)
    // seja executado apenas no client, após a montagem do componente.
    // Você pode deixar esse useEffect vazio se a lógica de atualização
    // já estiver dentro do seu hook useRefreshAccessToken.
  }, []); // O array de dependências vazio garante que o useEffect rode apenas uma vez

  // Este componente não precisa renderizar nada, a lógica está no hook.
  return null;

  // Ou, se você quiser exibir alguma informação sobre o processo de atualização:
  // return <div>{isRefreshing && <p>Atualizando token...</p>}</div>;
}
