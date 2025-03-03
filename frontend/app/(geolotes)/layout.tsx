import { redirect } from "next/navigation";
import RefreshAccessToken from "../(auth)/components/RefreshAccessToken";
import { Header } from "../components/Header";
import { getSession } from "../lib/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      {/* Navbar fixa no topo */}
      <Header />
      <RefreshAccessToken />
      {/* Wrapper para o conteúdo, garantindo espaço para a navbar */}
      <main className="flex min-h-screen w-full flex-col pt-16 p-4">
        {children}
      </main>
    </>
  );
}
