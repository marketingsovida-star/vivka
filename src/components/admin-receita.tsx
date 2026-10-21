import { useEffect, useState } from "react";

/* Receita no /admin: pré-visualização do arquivo, baixar, abrir em nova aba e gerar PDF
   da solicitação (receita digitada ou anexada + dados do cliente) via impressão do navegador.
   Porte do admin-receita da Bersch Health. */

type Sign = (path: string, download?: string) => Promise<string | null>;

export type FichaPedido = {
  nome?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  rg?: string | null;
  cpf?: string | null;
  data_nascimento?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  referencia?: string | null;
  frete?: string | null;
  created_at?: string | null;
};

function kindOf(path: string) {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
  return "other"; // ex.: HEIC não abre no navegador
}

function slug(v: string) {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function esc(v: unknown) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function ReceitaAdmin({
  path,
  text,
  pedido,
  sign,
  marcaNome = "Vivka",
}: {
  path: string | null | undefined;
  text: string | null | undefined;
  pedido: FichaPedido;
  sign: Sign;
  marcaNome?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const kind = path ? kindOf(path) : null;
  const base = `receita-${slug(pedido.nome || "cliente") || "cliente"}`;

  useEffect(() => {
    if (!path) return;
    let alive = true;
    setLoading(true);
    sign(path)
      .then((u) => alive && setUrl(u))
      .catch(() => alive && setMsg("Não foi possível carregar a receita."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  async function baixar() {
    if (!path) return;
    try {
      const ext = path.split(".").pop() ?? "pdf";
      const u = await sign(path, `${base}.${ext}`);
      if (u) window.location.href = u;
    } catch {
      setMsg("Não foi possível baixar a receita.");
    }
  }

  function gerarPdf() {
    const w = window.open("", "_blank");
    if (!w) return setMsg("Libere pop-ups para gerar o PDF.");
    const end = [pedido.logradouro, pedido.numero, pedido.complemento].filter(Boolean).join(", ");
    const linhas: [string, unknown][] = [
      ["Nome", pedido.nome],
      ["E-mail", pedido.email],
      ["WhatsApp", pedido.whatsapp],
      ["RG", pedido.rg],
      ["CPF", pedido.cpf],
      ["Nascimento", pedido.data_nascimento ? pedido.data_nascimento.split("-").reverse().join("/") : ""],
      ["Endereço", end],
      ["Bairro", pedido.bairro],
      ["Cidade/UF", pedido.cidade ? `${pedido.cidade}/${pedido.uf ?? ""}` : ""],
      ["CEP", pedido.cep],
      ["Referência", pedido.referencia],
      ["Frete", pedido.frete === "sedex" ? "Sedex" : pedido.frete === "pac" ? "PAC" : pedido.frete],
    ];
    const receita = text
      ? `<pre>${esc(text)}</pre>`
      : url && kind === "image"
        ? `<img src="${esc(url)}" alt="Receita" />`
        : url
          ? `<p>Receita anexada em arquivo (${esc(path?.split(".").pop()?.toUpperCase())}). Use "Baixar receita" no painel para salvar o arquivo original.</p>`
          : "<p>—</p>";
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(base)}</title>
<style>
  body{font-family:Jost,Arial,sans-serif;color:#1a2438;margin:32px;max-width:760px}
  h1{font-size:22px;margin:0 0 4px;color:#0b1d3a} .sub{color:#6b6b6b;font-size:12px;margin-bottom:20px}
  h2{font-size:13px;letter-spacing:.15em;text-transform:uppercase;color:#b8902f;border-bottom:1px solid #eadfc9;padding-bottom:4px;margin-top:24px}
  table{border-collapse:collapse;width:100%;font-size:13px} td{padding:4px 0;vertical-align:top} td:first-child{color:#6b6b6b;width:130px}
  pre{white-space:pre-wrap;font-family:inherit;font-size:14px;background:#fff9ee;border:1px solid #eadfc9;border-radius:8px;padding:14px}
  img{max-width:100%;border:1px solid #eadfc9;border-radius:8px}
  @media print{body{margin:16mm}}
</style></head><body>
<h1>Solicitação ${esc(marcaNome)} Pharma</h1>
<div class="sub">${pedido.created_at ? esc(new Date(pedido.created_at).toLocaleString("pt-BR")) : ""}</div>
<h2>Receita</h2>${receita}
<h2>Dados do cliente</h2><table>${linhas.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v) || "—"}</td></tr>`).join("")}</table>
<script>window.onload=function(){setTimeout(function(){window.print()},300)}</script>
</body></html>`);
    w.document.close();
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(text ?? "");
      setMsg("Fórmula copiada.");
    } catch {
      setMsg("Não foi possível copiar.");
    }
  }

  const btn = "rounded-full border border-vk-azul px-4 py-1.5 text-xs text-vk-azul transition-colors hover:bg-vk-areia";

  return (
    <div className="space-y-3">
      {text ? (
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-vk-linha bg-vk-creme p-3 font-sans text-sm">{text}</pre>
      ) : path ? (
        <div className="overflow-hidden rounded-md border border-vk-linha bg-vk-areia/50">
          {loading && <p className="p-4 text-xs text-vk-tinta/60">Carregando receita…</p>}
          {url && kind === "pdf" && <iframe src={url} title="Receita" className="h-[480px] w-full bg-white" />}
          {url && kind === "image" && <img src={url} alt="Receita anexada" className="max-h-[480px] w-full bg-white object-contain" />}
          {url && kind === "other" && (
            <p className="p-4 text-xs text-vk-tinta/60">Este formato não tem pré-visualização no navegador. Use "Baixar receita".</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-vk-tinta/60">Nenhuma receita enviada.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {path && (
          <>
            <button type="button" onClick={baixar} className={btn}>
              Baixar receita
            </button>
            {url && (
              <a href={url} target="_blank" rel="noreferrer" className={btn}>
                Abrir em nova aba
              </a>
            )}
          </>
        )}
        {text && (
          <button type="button" onClick={copiar} className={btn}>
            Copiar fórmula
          </button>
        )}
        {(path || text) && (
          <button type="button" onClick={gerarPdf} className={btn}>
            Gerar PDF da solicitação
          </button>
        )}
      </div>
      {msg && <p className="text-xs text-vk-tinta/70">{msg}</p>}
    </div>
  );
}
