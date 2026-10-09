import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, MessageCircle, Lock } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { type Preco, type ProdutoId, asset, whatsappUrl } from "@/data/produtos";

export const NAV = [
  { href: "/#produtos", label: "Produtos" },
  { href: "/#dia-e-noite", label: "Dia + Noite" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#faq", label: "FAQ" },
];

/* Expressão de cor de cada produto (MIV p.2: azul sobre amarelo / dourado sobre azul).
   Strings completas para o scanner do Tailwind. */
export const THEME: Record<
  ProdutoId,
  {
    bg: string;
    text: string;
    dot: string;
    mark: string;
    btn: string;
    ring: string;
    chip: string;
    check: string;
    tableHead: string;
  }
> = {
  control: {
    bg: "bg-vk-amarelo",
    text: "text-vk-azul",
    dot: "bg-vk-amarelo",
    mark: "mark-dia",
    btn: "bg-vk-amarelo text-vk-azul hover:bg-vk-mel",
    ring: "focus-visible:ring-vk-amarelo",
    chip: "border border-vk-amarelo/80 bg-vk-amarelo/25 text-vk-azul",
    check: "bg-vk-amarelo text-vk-azul",
    tableHead: "bg-vk-amarelo text-vk-azul",
  },
  night: {
    bg: "bg-vk-azul",
    text: "text-vk-azul",
    dot: "bg-vk-dourado",
    mark: "mark-noite",
    btn: "bg-vk-azul text-vk-creme hover:bg-vk-noite",
    ring: "focus-visible:ring-vk-azul",
    chip: "border border-vk-dourado/70 bg-vk-dourado/15 text-vk-azul",
    check: "bg-vk-azul text-vk-dourado",
    tableHead: "bg-vk-azul text-vk-dourado",
  },
};

/* ---------- Logo (wordmark desenhado — só como imagem) ---------- */
export function Logo({
  variant = "azul",
  className = "h-7",
}: {
  variant?: "azul" | "creme" | "dourado" | "branco" | "vinho";
  className?: string;
}) {
  return <img src={asset(`/brand/logo-${variant}.png`)} alt="Vivka" className={`${className} w-auto`} draggable={false} />;
}

/* ---------- Eyebrow com filete (as réguas finas do MIV) ---------- */
export function Eyebrow({
  children,
  rule = "bg-vk-dourado",
  className = "",
  center = false,
}: {
  children: React.ReactNode;
  rule?: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <p className={`label-caps flex items-center gap-3 ${center ? "justify-center" : ""} ${className}`.trim()}>
      <span className={`h-px w-7 shrink-0 ${rule}`} aria-hidden="true" />
      <span>{children}</span>
      {center && <span className={`h-px w-7 shrink-0 ${rule}`} aria-hidden="true" />}
    </p>
  );
}

/* ---------- Botões ---------- */
const BTN_BASE =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-7 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2";
export const BTN = {
  primary: `${BTN_BASE} bg-vk-azul text-vk-creme hover:bg-vk-noite focus-visible:ring-vk-azul`,
  outline: `${BTN_BASE} border border-vk-azul text-vk-azul hover:bg-vk-areia focus-visible:ring-vk-azul`,
  yellow: `${BTN_BASE} bg-vk-amarelo text-vk-azul hover:bg-vk-mel focus-visible:ring-vk-amarelo`,
  gold: `${BTN_BASE} bg-vk-dourado text-vk-azul hover:bg-[#d8a63f] focus-visible:ring-vk-dourado`,
  light: `${BTN_BASE} bg-vk-creme text-vk-azul hover:bg-white focus-visible:ring-vk-creme`,
  lightOutline: `${BTN_BASE} border border-vk-creme/60 text-vk-creme hover:bg-vk-creme/10 focus-visible:ring-vk-creme`,
};

/* ---------- Top bar persistente (páginas de produto) ---------- */
export function ProductTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-vk-linha bg-vk-creme/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        <Link to="/" aria-label="Vivka — início">
          <Logo variant="azul" className="h-5 md:h-6" />
        </Link>
        <Link to="/#produtos" className="text-sm text-vk-tinta/75 transition-colors hover:text-vk-azul">
          ← Voltar aos produtos
        </Link>
      </div>
    </header>
  );
}

/* ---------- Grade de preços (sem checkout — leva ao WhatsApp) ---------- */
export function PriceCards({
  precos,
  produtoNome,
  imagePrefix,
  accent,
}: {
  precos: Preco[];
  produtoNome: string;
  imagePrefix: string;
  accent?: ProdutoId;
}) {
  const dot = accent ? THEME[accent].dot : "bg-vk-dourado";
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {precos.map((p, i) => {
        const featured = !!p.destaque;
        const msg = `Oi Vivka! Quero adquirir ${p.label} de ${produtoNome}.`;
        return (
          <Reveal
            key={p.qtd}
            delay={((i % 3) + 1) as 1 | 2 | 3}
            className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-[var(--shadow-card)] ${
              featured ? "border-vk-azul ring-4 ring-vk-dourado/35" : "border-vk-linha"
            }`}
          >
            {p.destaque && (
              <span className="label-caps absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-vk-amarelo px-4 py-1 text-[11px] text-vk-azul">
                {p.destaque}
              </span>
            )}
            <div className="mb-5 flex h-40 items-end justify-center">
              <img
                src={asset(`/products/${imagePrefix}-${p.qtd}.webp`)}
                alt={`${produtoNome} — ${p.label}`}
                loading="lazy"
                className="max-h-40 w-auto max-w-full object-contain"
              />
            </div>
            <p className="label-caps flex items-center gap-2 text-vk-azul">
              <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
              {p.label}
            </p>
            <p className="mt-1 text-sm text-vk-tinta/60">{p.unidade}</p>
            <div className="my-6 border-y border-vk-linha py-6">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-vk-tinta/60">R$</span>
                <span className="font-display text-5xl font-medium text-vk-azul">{p.total}</span>
              </div>
              {p.economia && <p className="mt-2 text-xs font-semibold text-vk-azul">{p.economia}</p>}
            </div>
            <a
              href={whatsappUrl(msg)}
              target="_blank"
              rel="noreferrer"
              className={`mt-auto ${featured ? BTN.primary : BTN.outline}`}
            >
              Adquirir
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ---------- Selos de confiança ---------- */
export function TrustStrip({ dark = false }: { dark?: boolean }) {
  const itens = [
    { icon: ShieldCheck, label: "Garantia de 7 dias" },
    { icon: Lock, label: "Compra segura" },
    { icon: Truck, label: "Entrega para todo o Brasil" },
    { icon: MessageCircle, label: "Suporte rápido" },
  ];
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
      {itens.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-2 text-center">
          <Icon className={`h-6 w-6 ${dark ? "text-vk-dourado" : "text-vk-azul"}`} strokeWidth={1.4} aria-hidden="true" />
          <span className={`text-xs ${dark ? "text-vk-creme/75" : "text-vk-tinta/70"}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Rodapé (dourado sobre azul — expressão noturna) ---------- */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-vk-azul text-vk-creme">
      <img
        src={asset("/brand/v-dourado.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 w-64 opacity-[0.06] md:w-80"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label="Vivka — página inicial" className="inline-block">
              <Logo variant="dourado" className="h-7" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-vk-creme/70">
              Liberdade para o seu dia. Descanso para a sua noite. Control e Night são suplementos alimentares, não
              medicamentos, e não substituem uma alimentação equilibrada nem acompanhamento profissional.
            </p>
          </div>
          <div>
            <div className="label-caps text-vk-dourado">Navegação</div>
            <ul className="mt-4 space-y-2 text-sm text-vk-creme/75">
              <li>
                <Link to="/" className="transition-colors hover:text-vk-dourado">
                  Página inicial
                </Link>
              </li>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link to={n.href} className="transition-colors hover:text-vk-dourado">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-caps text-vk-dourado">Produtos e ajuda</div>
            <ul className="mt-4 space-y-2 text-sm text-vk-creme/75">
              <li>
                <Link to="/control" className="transition-colors hover:text-vk-dourado">
                  Vivka Control
                </Link>
              </li>
              <li>
                <Link to="/night" className="transition-colors hover:text-vk-dourado">
                  Vivka Night
                </Link>
              </li>
              <li>
                <Link to="/sac" className="transition-colors hover:text-vk-dourado">
                  Atendimento (SAC)
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 grid gap-2 border-t border-vk-creme/15 pt-6 text-center text-xs text-vk-creme/60 md:grid-cols-[1fr_auto] md:text-left">
          <p>© {new Date().getFullYear()} Vivka. Todos os direitos reservados.</p>
          <p className="md:text-right">
            Desenvolvido por{" "}
            <a
              href="https://suamarcawellness.com.br/"
              target="_blank"
              rel="noreferrer"
              className="text-vk-creme underline underline-offset-4 transition-colors hover:text-vk-dourado"
            >
              SMW
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
