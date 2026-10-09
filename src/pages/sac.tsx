import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Paperclip, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BTN, Eyebrow, Footer } from "@/components/vivka-ui";
import { SAC_EMAIL, SAC_FORM_ENDPOINT, asset } from "@/data/produtos";
import { useHead } from "@/lib/head";

const SAC_MOTIVOS = [
  "Meu pedido não chegou",
  "Meu pedido veio com erro",
  "Quero trocar ou devolver",
  "Dúvida sobre o produto",
  "Outro assunto",
] as const;

const SAC_CANAIS = [
  { value: "email", label: "E-mail" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "ligacao", label: "Ligação telefônica" },
] as const;

type Canal = (typeof SAC_CANAIS)[number]["value"];

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-vk-linha bg-vk-creme/50 px-3.5 py-2.5 text-sm text-vk-tinta outline-none transition placeholder:text-vk-tinta/35 focus:border-vk-azul/50 focus:bg-white focus:ring-2 focus:ring-vk-dourado/60";
const labelClass = "mb-1.5 block text-xs font-semibold text-vk-azul/85";

const maskCpf = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export function SacPage() {
  useHead({
    title: "SAC Vivka — atendimento ao cliente",
    description:
      "Abra um chamado com o atendimento da Vivka: dúvidas sobre pedidos, entrega, trocas e produtos. Retorno por e-mail, WhatsApp ou ligação.",
    path: "/sac",
  });

  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [canal, setCanal] = useState<Canal>("email");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"enviado" | "mailto" | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const canalLabel = SAC_CANAIS.find((c) => c.value === canal)?.label ?? canal;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const picked = Array.from(list);
    if (picked.some((f) => f.size > MAX_SIZE)) {
      setError("Cada arquivo pode ter no máximo 10 MB.");
      return;
    }
    if (files.length + picked.length > MAX_FILES) {
      setError(`Você pode anexar até ${MAX_FILES} arquivos.`);
    } else {
      setError(null);
    }
    setFiles([...files, ...picked].slice(0, MAX_FILES));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !motivo || !nome.trim() || !assunto.trim() || descricao.trim().length < 5) {
      setError("Preencha os campos obrigatórios para abrir o chamado.");
      return;
    }
    setSending(true);
    try {
      const subject = `[SAC Vivka] ${motivo} — ${assunto.trim()}`;
      if (SAC_FORM_ENDPOINT) {
        const fd = new FormData();
        fd.append("_subject", subject);
        fd.append("email", email.trim());
        fd.append("motivo", motivo);
        fd.append("nome", nome.trim());
        fd.append("cpf", cpf.trim());
        fd.append("telefone", telefone.trim());
        fd.append("assunto", assunto.trim());
        fd.append("descricao", descricao.trim());
        fd.append("canal_retorno", canalLabel);
        files.forEach((f, i) => fd.append(`anexo_${i + 1}`, f, f.name));
        const res = await fetch(SAC_FORM_ENDPOINT, {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Não foi possível abrir seu chamado. Tente novamente em instantes.");
        setDone("enviado");
      } else {
        // Sem backend configurado: abre o e-mail do cliente com o chamado preenchido.
        const body = [
          `Motivo: ${motivo}`,
          `Assunto: ${assunto.trim()}`,
          "",
          `Nome: ${nome.trim()}`,
          `E-mail: ${email.trim()}`,
          cpf.trim() ? `CPF: ${cpf.trim()}` : null,
          telefone.trim() ? `Telefone: ${telefone.trim()}` : null,
          `Prefiro retorno por: ${canalLabel}`,
          "",
          "Descrição:",
          descricao.trim(),
          files.length ? `\n(${files.length} anexo(s) para enviar junto com este e-mail)` : null,
        ]
          .filter((l) => l !== null)
          .join("\n");
        window.location.href = `mailto:${SAC_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setDone("mailto");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir seu chamado.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-vk-creme text-vk-tinta">
      <main className="relative flex-1 overflow-hidden">
        <img
          src={asset("/brand/v-dourado.png")}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-16 w-72 opacity-[0.08] md:w-[26rem]"
        />
        <div className="relative mx-auto max-w-3xl px-6 py-14 md:py-20">
          <Reveal immediate className="text-center">
            <Eyebrow center className="text-vk-azul">
              Atendimento ao cliente
            </Eyebrow>
            <h1 className="mt-3 text-4xl font-medium leading-tight text-vk-azul md:text-5xl">
              Como podemos te ajudar?
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-vk-tinta/70 md:text-base">
              Abra um chamado pelo formulário abaixo. Nosso time responde pelo canal que você escolher: e-mail,
              WhatsApp ou ligação.
            </p>
          </Reveal>

          {done ? (
            <Reveal immediate className="mt-10 rounded-3xl border border-vk-linha bg-white p-8 text-center shadow-[var(--shadow-card)] md:p-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-vk-amarelo text-vk-azul">
                <Check className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-medium text-vk-azul md:text-3xl">
                {done === "enviado" ? "Chamado aberto" : "Chamado preparado"}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-vk-tinta/70">
                {done === "enviado" ? (
                  <>
                    Recebemos sua mensagem. Nosso time entra em contato por {canalLabel.toLowerCase()} em até 2 dias
                    úteis.
                  </>
                ) : (
                  <>
                    Abrimos o seu aplicativo de e-mail com o chamado preenchido: é só enviar. Se ele não abriu, escreva
                    para{" "}
                    <a href={`mailto:${SAC_EMAIL}`} className="font-semibold text-vk-azul underline underline-offset-4">
                      {SAC_EMAIL}
                    </a>
                    .
                  </>
                )}
              </p>
              <Link to="/" className={`mt-7 ${BTN.primary}`}>
                Voltar ao site
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          ) : (
            <Reveal immediate delay={1}>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-10 rounded-3xl border border-vk-linha bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="email">
                      Endereço de e-mail <span className="text-vk-vinho">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="motivo">
                      Motivo do contato <span className="text-vk-vinho">*</span>
                    </label>
                    <select
                      id="motivo"
                      required
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Selecione um motivo</option>
                      {SAC_MOTIVOS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="nome">
                      Nome completo <span className="text-vk-vinho">*</span>
                    </label>
                    <input
                      id="nome"
                      autoComplete="name"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Como consta no pedido"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cpf">
                      CPF
                    </label>
                    <input
                      id="cpf"
                      inputMode="numeric"
                      value={cpf}
                      onChange={(e) => setCpf(maskCpf(e.target.value))}
                      placeholder="000.000.000-00"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="telefone">
                      Telefone
                    </label>
                    <input
                      id="telefone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(maskPhone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="assunto">
                      Assunto <span className="text-vk-vinho">*</span>
                    </label>
                    <input
                      id="assunto"
                      required
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      placeholder="Resuma o motivo do contato"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelClass} htmlFor="descricao">
                    Descrição <span className="text-vk-vinho">*</span>
                  </label>
                  <textarea
                    id="descricao"
                    required
                    rows={5}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Conte com detalhes o que aconteceu para que possamos te ajudar da melhor forma."
                    className={`${inputClass} resize-y`}
                  />
                </div>

                <div className="mt-6">
                  <span className={labelClass}>
                    Como prefere receber o retorno <span className="text-vk-vinho">*</span>
                  </span>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {SAC_CANAIS.map((c) => {
                      const active = canal === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setCanal(c.value)}
                          className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                            active
                              ? "border-vk-azul bg-vk-azul text-vk-creme"
                              : "border-vk-linha bg-vk-creme/50 text-vk-tinta/75 hover:bg-vk-areia"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <span className={labelClass}>Anexos</span>
                  <div className="rounded-2xl border border-dashed border-vk-linha bg-vk-creme/40 p-5">
                    <button
                      type="button"
                      onClick={() => fileInput.current?.click()}
                      className="inline-flex items-center gap-2 rounded-full border border-vk-azul/30 bg-white px-4 py-2 text-sm font-medium text-vk-azul transition hover:bg-vk-areia"
                    >
                      <Paperclip className="h-4 w-4" aria-hidden="true" />
                      Escolher arquivos
                    </button>
                    <input
                      ref={fileInput}
                      type="file"
                      multiple
                      accept="image/*,application/pdf,video/*"
                      className="hidden"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <p className="mt-3 text-xs text-vk-tinta/55">
                      Até {MAX_FILES} arquivos (fotos, vídeos ou PDF), máximo de 10 MB cada.
                    </p>
                    {files.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {files.map((f, i) => (
                          <li
                            key={`${f.name}-${i}`}
                            className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs text-vk-tinta/80"
                          >
                            <span className="truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                              className="inline-flex items-center gap-1 text-vk-tinta/55 transition hover:text-vk-vinho"
                              aria-label={`Remover ${f.name}`}
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" /> remover
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {error && (
                  <p role="alert" className="mt-5 rounded-xl border border-vk-vinho/30 bg-vk-vinho/8 px-4 py-2.5 text-sm text-vk-vinho">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={sending} className={`mt-7 w-full sm:w-auto ${BTN.primary} disabled:opacity-60`}>
                  {sending ? "Enviando..." : "Enviar chamado"}
                  {!sending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                </button>
              </form>
            </Reveal>
          )}

          <p className="mt-8 text-center text-sm text-vk-tinta/60">
            Dúvidas comuns também estão na{" "}
            <Link to="/#faq" className="font-semibold text-vk-azul underline underline-offset-4 hover:text-vk-vinho">
              página inicial
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
