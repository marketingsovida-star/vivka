import { useState, type InputHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Headphones, Loader2, Mail, Package, Paperclip } from "lucide-react";
import { Footer, SiteHeader } from "@/components/vivka-ui";
import { PHARMA_EMAIL, PHARMA_FORM_ENDPOINT, WHATSAPP_NUMBER, asset } from "@/data/produtos";
import { useHead } from "@/lib/head";

/* Página Vivka Pharma — mesmo layout e fluxo da /pharma da Sanoví, com a estética Vivka. */

const WHATSAPP_FLOAT = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Estava no site VIVKA PHARMA e gostaria de fazer um orçamento por aqui.",
)}`;

const DESC =
  "Anexe sua receita ou solicite uma fórmula personalizada. Manipulação certificada, envio nacional e resposta em até 24h úteis.";

export function PharmaPage() {
  useHead({
    title: "Vivka Pharma — Fórmulas manipuladas sob medida",
    description: DESC,
    path: "/pharma",
    ogImage: "/og-image.jpg",
  });

  const [open, setOpen] = useState(false);
  const steps = [
    {
      t: "Envie sua receita",
      d: "Anexe o PDF ou imagem da prescrição médica, ou digite a fórmula, se preferir. Seu documento fica em ambiente privado.",
      Icon: FileText,
    },
    {
      t: "Receba seu orçamento",
      d: "Nossa equipe farmacêutica analisa e retorna com o valor personalizado em até 24h úteis, pelo contato informado.",
      Icon: Mail,
    },
    {
      t: "Manipulação e envio",
      d: "Após aprovação e pagamento, sua fórmula é manipulada e enviada para todo o Brasil, com código de rastreio.",
      Icon: Package,
    },
  ];

  return (
    <div className="min-h-screen bg-vk-creme text-vk-tinta">
      <header className="sticky top-0 z-40">
        <SiteHeader />
      </header>

      <main className="mx-auto max-w-[1000px] px-4 py-8 md:px-6 md:py-14">
        <section className="grid items-center gap-8 overflow-hidden rounded-3xl border border-vk-dourado/40 bg-vk-areia px-6 py-8 md:grid-cols-[1.7fr_1fr] md:px-10 md:py-12">
          <div className="order-2 flex animate-fade-in flex-col items-center text-center md:order-1 md:items-start md:text-left">
            <span className="label-caps inline-flex items-center gap-2 rounded-full border border-vk-dourado/60 bg-white/70 px-3 py-1 text-[10px] text-vk-azul">
              <span className="h-1.5 w-1.5 rounded-full bg-vk-dourado" aria-hidden="true" />
              Resposta em até 24h úteis
            </span>
            <h1 className="mt-4 whitespace-nowrap text-4xl font-medium leading-[1.08] text-vk-azul sm:text-5xl md:text-[52px]">
              Cuidado <span className="mark-noite">exclusivo.</span>
            </h1>
            <p className="mt-4 max-w-[560px] text-base leading-relaxed text-vk-tinta/75">
              Anexe sua receita e receba um orçamento personalizado, manipulado com a precisão e o cuidado da nossa
              farmácia parceira.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group mt-7 inline-flex min-h-12 w-full max-w-[560px] items-center justify-center gap-3 rounded-full bg-vk-azul px-7 text-sm font-semibold text-vk-creme transition-colors hover:bg-vk-noite"
            >
              Solicitar minha fórmula
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </div>
          <div
            className="order-1 flex animate-fade-in items-center justify-center md:order-2"
            style={{ animationDelay: "150ms", animationFillMode: "both" }}
          >
            <img
              src={asset("/photos/pharma-frasco.webp")}
              alt="Fórmula manipulada Vivka Pharma"
              width={700}
              height={700}
              loading="eager"
              className="h-auto w-auto max-h-[240px] object-contain md:max-h-[380px]"
            />
          </div>
        </section>

        <h2 className="label-caps mt-12 text-center text-vk-azul">Como funciona</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.t} className="rounded-2xl bg-vk-azul px-6 py-7 text-center text-vk-creme">
              <s.Icon className="mx-auto h-5 w-5 text-vk-dourado" aria-hidden="true" />
              <h3 className="mt-3 text-2xl font-medium text-vk-creme">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-vk-creme/75">{s.d}</p>
            </div>
          ))}
        </div>
        <Link
          to="/sac"
          className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-vk-azul px-6 py-5 text-vk-creme transition-colors hover:bg-vk-noite"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-vk-creme/10 text-vk-dourado">
            <Headphones className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold">Ainda com dúvidas?</span>
            <span className="block text-xs text-vk-creme/75">Fale com a nossa equipe</span>
          </span>
        </Link>
      </main>

      <Footer />

      <a
        href={WHATSAPP_FLOAT}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com a Vivka Pharma"
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-vk-azul text-vk-creme shadow-xl transition hover:scale-105 md:h-16 md:w-16"
      >
        <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current md:h-9 md:w-9" aria-hidden="true">
          <path d="M16.004 3.2c-7.06 0-12.8 5.738-12.8 12.8 0 2.258.592 4.467 1.718 6.413L3.2 28.8l6.566-1.722a12.74 12.74 0 0 0 6.238 1.622h.006c7.059 0 12.798-5.74 12.798-12.8 0-3.42-1.333-6.636-3.752-9.055A12.72 12.72 0 0 0 16.004 3.2Zm0 23.043h-.005a10.63 10.63 0 0 1-5.413-1.483l-.389-.23-3.896 1.021 1.04-3.797-.253-.39a10.59 10.59 0 0 1-1.627-5.654c.002-5.85 4.762-10.61 10.616-10.61 2.835 0 5.5 1.105 7.503 3.11a10.55 10.55 0 0 1 3.106 7.508c-.002 5.851-4.762 10.611-10.682 10.611Zm5.821-7.943c-.319-.16-1.886-.93-2.177-1.037-.291-.107-.503-.16-.715.16-.212.319-.822 1.036-1.008 1.249-.186.212-.371.239-.69.08-.319-.16-1.346-.496-2.563-1.582-.948-.845-1.588-1.889-1.774-2.208-.186-.319-.02-.492.14-.65.143-.143.319-.372.479-.558.159-.186.212-.319.319-.531.106-.213.053-.399-.027-.558-.08-.16-.715-1.723-.98-2.359-.258-.62-.52-.536-.715-.546l-.61-.01c-.212 0-.557.08-.848.399-.291.319-1.112 1.087-1.112 2.651 0 1.564 1.138 3.075 1.298 3.288.159.212 2.24 3.42 5.427 4.794.758.327 1.35.522 1.812.669.761.242 1.453.208 2.001.126.611-.091 1.886-.771 2.152-1.515.265-.744.265-1.382.186-1.515-.08-.133-.291-.212-.61-.372Z" />
        </svg>
      </a>

      {open && <QuizModal onClose={() => setOpen(false)} />}
    </div>
  );
}

/* ---------- Modal em etapas (quiz + anexo + contato) ---------- */
const QUIZ_STEPS = [
  {
    key: "objetivo",
    title: "O que você precisa manipular?",
    options: [
      "Sono e relaxamento",
      "Controle de apetite e vontade de doces",
      "Emagrecimento e metabolismo",
      "Vitaminas e suplementos",
      "Reposição hormonal",
      "Outro",
    ],
  },
  {
    key: "receita",
    title: "Você já tem a receita em mãos?",
    options: ["Sim, tenho a receita", "Ainda não tenho", "Tenho, mas está vencida"],
  },
  {
    key: "urgencia",
    title: "Para quando você precisa?",
    options: ["O quanto antes", "Nos próximos 7 dias", "Sem pressa, só quero o orçamento"],
  },
] as const;

const TOTAL_STEPS = QUIZ_STEPS.length + 2; // + observações + contato
const MAX_FILE = 10 * 1024 * 1024;

type Contact = {
  name: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

function QuizModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [contact, setContact] = useState<Contact>({
    name: "",
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"enviado" | "mailto" | null>(null);

  async function handleCep(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setContact((c) => ({ ...c, cep: masked }));
    if (digits.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const json = (await res.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string };
      if (json.erro) return;
      setContact((c) => ({
        ...c,
        street: json.logradouro || c.street,
        neighborhood: json.bairro || c.neighborhood,
        city: json.localidade || c.city,
        state: json.uf || c.state,
      }));
    } catch {
      /* preenchimento manual */
    }
  }

  function pick(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  async function finish() {
    if (busy) return;
    setError(null);
    if (!contact.name.trim() || !contact.email.trim() || !contact.phone.trim()) {
      setError("Preencha nome, e-mail e WhatsApp.");
      return;
    }
    if (
      !contact.cep.trim() ||
      !contact.street.trim() ||
      !contact.number.trim() ||
      !contact.neighborhood.trim() ||
      !contact.city.trim() ||
      !contact.state.trim()
    ) {
      setError("Preencha o endereço completo com CEP.");
      return;
    }
    if (!consent) {
      setError("É preciso aceitar o consentimento para enviar.");
      return;
    }
    if (file && file.size > MAX_FILE) {
      setError("O arquivo excede 10 MB.");
      return;
    }
    setBusy(true);
    const endereco = [
      [contact.street.trim(), contact.number.trim()].filter(Boolean).join(", "),
      contact.complement.trim(),
      contact.neighborhood.trim(),
      `${contact.city.trim()} / ${contact.state.trim().toUpperCase()}`,
      `CEP ${contact.cep.trim()}`,
    ]
      .filter(Boolean)
      .join(" — ");
    const subject = `[Vivka Pharma] Nova solicitação — ${contact.name.trim()}`;
    try {
      if (PHARMA_FORM_ENDPOINT) {
        const fd = new FormData();
        fd.append("_subject", subject);
        fd.append("nome", contact.name.trim());
        fd.append("email", contact.email.trim());
        fd.append("whatsapp", contact.phone.trim());
        fd.append("endereco", endereco);
        Object.entries(answers).forEach(([k, v]) => fd.append(k, v));
        fd.append("observacoes", notes.trim());
        if (file) fd.append("receita", file, file.name);
        const res = await fetch(PHARMA_FORM_ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("Não foi possível enviar sua solicitação. Tente novamente em instantes.");
        setDone("enviado");
      } else {
        // Sem backend configurado: abre o e-mail do cliente com a solicitação preenchida.
        const body = [
          ...QUIZ_STEPS.map((q) => `${q.title} ${answers[q.key] ?? "—"}`),
          "",
          `Nome: ${contact.name.trim()}`,
          `E-mail: ${contact.email.trim()}`,
          `WhatsApp: ${contact.phone.trim()}`,
          `Endereço: ${endereco}`,
          "",
          "Observações:",
          notes.trim() || "—",
          file ? `\n(Receita para anexar a este e-mail: ${file.name})` : null,
        ]
          .filter((l) => l !== null)
          .join("\n");
        window.location.href = `mailto:${PHARMA_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setDone("mailto");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  const progress = Math.round(((done ? TOTAL_STEPS : step) / TOTAL_STEPS) * 100);

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-vk-tinta/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg animate-scale-in overflow-y-auto rounded-3xl bg-vk-creme p-8 shadow-2xl">
        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-vk-dourado" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-medium text-vk-azul">{done === "enviado" ? "Recebemos!" : "Quase lá!"}</h2>
            <p className="mt-3 text-sm text-vk-tinta/70">
              {done === "enviado" ? (
                "Sua solicitação foi registrada. Retornamos com o orçamento em até 24h úteis."
              ) : (
                <>
                  Abrimos o seu aplicativo de e-mail com a solicitação preenchida: é só enviar
                  {file ? " e anexar a receita" : ""}. Se ele não abriu, escreva para{" "}
                  <a href={`mailto:${PHARMA_EMAIL}`} className="font-semibold text-vk-azul underline underline-offset-4">
                    {PHARMA_EMAIL}
                  </a>
                  .
                </>
              )}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-8 inline-flex items-center rounded-full bg-vk-azul px-6 py-2.5 text-sm font-medium text-vk-creme hover:bg-vk-noite"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="label-caps text-vk-azul/70">Vivka Pharma</p>
                <h2 className="mt-1 text-2xl font-medium text-vk-azul">Solicitar orçamento</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-vk-tinta/50 transition hover:bg-vk-areia hover:text-vk-tinta"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-vk-linha">
              <div className="h-full rounded-full bg-vk-dourado transition-all duration-300" style={{ width: `${Math.max(progress, 8)}%` }} />
            </div>

            {step < QUIZ_STEPS.length && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-medium text-vk-azul">{QUIZ_STEPS[step].title}</h3>
                <div className="mt-5 space-y-2.5">
                  {QUIZ_STEPS[step].options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => pick(QUIZ_STEPS[step].key, opt)}
                      className="w-full rounded-xl border border-vk-azul/15 bg-white px-4 py-3.5 text-left text-sm text-vk-tinta transition hover:border-vk-dourado hover:bg-vk-areia/60"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === QUIZ_STEPS.length && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-xl font-medium text-vk-azul">Anexe a receita e conte os detalhes</h3>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-vk-azul/30 bg-white px-4 py-3 text-sm text-vk-tinta/70 transition hover:border-vk-dourado hover:bg-vk-areia/60">
                  <Paperclip className="h-4 w-4 shrink-0 text-vk-dourado" aria-hidden="true" />
                  <span className="truncate">{file ? file.name : "Anexar PDF, JPG ou PNG (até 10 MB), opcional"}</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => setFile(e.currentTarget.files?.[0] ?? null)}
                  />
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-xl border border-vk-azul/15 bg-white px-4 py-3 text-sm outline-none focus:border-vk-dourado"
                  placeholder="Detalhes da fórmula, alergias, dosagem..."
                />
              </div>
            )}

            {step === QUIZ_STEPS.length + 1 && (
              <div className="animate-fade-in space-y-4">
                <h3 className="text-xl font-medium text-vk-azul">Para onde enviamos o orçamento?</h3>
                <Field label="Nome completo" name="name" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                <Field label="E-mail" name="email" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                <Field label="WhatsApp" name="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-0000" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                <div className="grid grid-cols-3 gap-3">
                  <Field label="CEP" name="cep" inputMode="numeric" placeholder="00000-000" maxLength={9} value={contact.cep} onChange={(e) => handleCep(e.target.value)} />
                  <div className="col-span-2">
                    <Field label="Rua / Logradouro" name="street" value={contact.street} onChange={(e) => setContact({ ...contact, street: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Número" name="number" value={contact.number} onChange={(e) => setContact({ ...contact, number: e.target.value })} />
                  <div className="col-span-2">
                    <Field label="Complemento (opcional)" name="complement" value={contact.complement} onChange={(e) => setContact({ ...contact, complement: e.target.value })} />
                  </div>
                </div>
                <Field label="Bairro" name="neighborhood" value={contact.neighborhood} onChange={(e) => setContact({ ...contact, neighborhood: e.target.value })} />
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Field label="Cidade" name="city" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
                  </div>
                  <Field label="UF" name="state" maxLength={2} value={contact.state} onChange={(e) => setContact({ ...contact, state: e.target.value })} />
                </div>
                <label className="flex items-start gap-3 text-xs text-vk-tinta/70">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-vk-azul" />
                  <span>Autorizo o uso dos meus dados para responder este orçamento, conforme a LGPD.</span>
                </label>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-5 rounded-xl border border-vk-vinho/30 bg-vk-vinho/8 px-4 py-2.5 text-sm text-vk-vinho">
                {error}
              </p>
            )}

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="label-caps inline-flex items-center gap-1.5 text-[11px] text-vk-tinta/60 disabled:opacity-30"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Voltar
              </button>

              {step === QUIZ_STEPS.length && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-vk-azul px-6 py-3 text-sm font-medium text-vk-creme hover:bg-vk-noite"
                >
                  Continuar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              {step === QUIZ_STEPS.length + 1 && (
                <button
                  type="button"
                  onClick={finish}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-vk-amarelo px-6 py-3 text-sm font-semibold text-vk-azul shadow-lg shadow-vk-amarelo/30 transition hover:bg-vk-mel disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  {busy ? "Enviando..." : "Enviar solicitação"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <div>
      <label htmlFor={`pharma-${name}`} className="label-caps mb-1.5 block text-[10px] text-vk-azul">
        {label}
      </label>
      <input
        id={`pharma-${name}`}
        name={name}
        type={type}
        className="w-full rounded-xl border border-vk-azul/15 bg-white px-4 py-3 text-sm outline-none focus:border-vk-dourado"
        {...rest}
      />
    </div>
  );
}
