import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/vivka-ui";
import { getSession, pharmaBackendEnabled, signIn } from "@/lib/pharma-backend";
import { useHead } from "@/lib/head";

export function AdminLoginPage() {
  useHead({ title: "Entrar — Vivka Admin", description: "Área administrativa da Vivka Pharma.", path: "/admin/login", noindex: true });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pharmaBackendEnabled) return;
    getSession().then((s) => {
      if (s) navigate("/admin/quiz", { replace: true });
    });
  }, [navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const session = await signIn(email, password);
    setLoading(false);
    if (!session) return setError("E-mail ou senha inválidos.");
    navigate("/admin/quiz", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-vk-creme px-6 text-vk-tinta">
      <div className="w-full max-w-sm">
        <Logo variant="azul" className="mx-auto h-6" />
        <p className="label-caps mt-6 text-center text-vk-azul/70">Vivka · Admin</p>
        <h1 className="mb-8 mt-2 text-center text-4xl font-medium text-vk-azul">Entrar no painel</h1>
        {!pharmaBackendEnabled && (
          <p className="mb-4 rounded-md border border-vk-vinho/30 bg-vk-vinho/8 px-3 py-2 text-sm text-vk-vinho">
            Backend Pharma ainda não configurado neste site.
          </p>
        )}
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="label-caps text-vk-azul">E-mail</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-vk-linha bg-white px-3 py-2 outline-none focus:border-vk-dourado"
            />
          </label>
          <label className="block">
            <span className="label-caps text-vk-azul">Senha</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-vk-linha bg-white px-3 py-2 outline-none focus:border-vk-dourado"
            />
          </label>

          {error && <p className="text-sm text-vk-vinho">{error}</p>}

          <button
            type="submit"
            disabled={loading || !pharmaBackendEnabled}
            className="w-full rounded-full bg-vk-azul py-3 text-sm font-semibold tracking-wide text-vk-creme hover:bg-vk-noite disabled:opacity-60"
          >
            {loading ? "..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
