import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Omni Platform
        </h1>
        <p className="text-2xl text-center">
          Sua solução completa para automação de marketing e vendas omnichannel.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/login"
          >
            <h3 className="text-2xl font-bold">Login →</h3>
            <div className="text-lg">
              Acesse sua conta para gerenciar suas campanhas e conversas.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/register"
          >
            <h3 className="text-2xl font-bold">Registrar →</h3>
            <div className="text-lg">
              Crie sua conta e comece a automatizar sua comunicação hoje mesmo.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}

