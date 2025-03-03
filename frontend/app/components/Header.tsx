import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full p-4 ">
      <div className="container-wrapper max-w-screen-2xl mx-auto shadow-lg p-2 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-4 flex items-center gap-2 lg:mr-6" href="/">
              <Image
                src="/icons/favicon-60x60.png"
                alt="GeoLotes"
                width={32}
                height={32}
              />
              <span className="hidden font-bold lg:inline-block">GeoLotes</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm xl:gap-6">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/80"
                href="/subdivisions"
              >
                Loteamentos
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/80"
                href="/customers"
              >
                Clientes
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/80"
                href="/pendencies"
              >
                Pendências
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/80"
                href="/dashboards"
              >
                Dashboards
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/80"
                href="/users"
              >
                Usuários
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end"></div>
        </div>
      </div>
    </header>
  );
}
