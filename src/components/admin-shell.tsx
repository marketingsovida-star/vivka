import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/vivka-ui";
import { getSession, pharmaBackendEnabled, signOut } from "@/lib/pharma-backend";

/* Exige sessão de admin: redireciona para /admin/login se não houver. Retorna true quando pode carregar dados. */
export function useAdminGuard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!pharmaBackendEnabled) {
      navigate("/admin/login", { replace: true });
      return;
    }
    getSession().then((s) => {
      if (!s) navigate("/admin/login", { replace: true });
      else setReady(true);
    });
  }, [navigate]);
  return ready;
}

/* Moldura das páginas /admin: cabeçalho com navegação e "Sair". */
export function AdminShell({ eyebrow, title, actions, children }: { eyebrow: string; title: string; actions?: ReactNode; children: ReactNode }) {
  const navigate = useNavigate();
  async function sair() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }
  return (
    <div className="min-h-screen bg-vk-creme text-vk-tinta">
      <header className="border-b border-vk-linha bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link to="/" aria-label="Vivka — site">
              <Logo variant="azul" className="h-5" />
            </Link>
            <div className="min-w-0">
              <p className="label-caps text-vk-azul/70">{eyebrow}</p>
              <h1 className="text-xl font-medium text-vk-azul sm:text-2xl">{title}</h1>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin/quiz" className="text-vk-tinta/70 hover:text-vk-azul">
              Solicitações
            </Link>
            <Link to="/admin/pharma-pedidos" className="text-vk-tinta/70 hover:text-vk-azul">
              Pedidos
            </Link>
            {actions}
            <button type="button" onClick={sair} className="text-vk-tinta/70 hover:text-vk-azul">
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-6">{children}</main>
    </div>
  );
}

export const inputAdmin = "mt-1 w-full rounded-md border border-vk-linha bg-white px-3 py-2 text-sm outline-none focus:border-vk-dourado";
export const btnAdmin = "rounded-full bg-vk-azul px-6 py-2.5 text-sm text-vk-creme hover:bg-vk-noite disabled:opacity-60";

export function fmtDate(v: string) {
  return new Date(v).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
export function fmtMoney(v: number | null | undefined) {
  if (v == null) return "—";
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
