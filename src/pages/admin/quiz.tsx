import { useEffect, useState } from "react";
import { ReceitaAdmin } from "@/components/admin-receita";
import { AdminShell, btnAdmin, fmtDate, fmtMoney, inputAdmin, useAdminGuard } from "@/components/admin-shell";
import { listLeads, signUrl, updateLead, type Lead } from "@/lib/pharma-backend";
import { useHead } from "@/lib/head";

/* Solicitações & carrinhos abandonados — porte do admin.quiz da Bersch. */

function completude(l: Lead) {
  const campos = [l.nome, l.email, l.rg, l.cpf, l.cep, l.logradouro, l.numero, l.bairro, l.cidade, l.uf];
  const ok = campos.filter((c) => c && String(c).trim().length > 0).length;
  return Math.round((ok / campos.length) * 100);
}

export function AdminQuizPage() {
  useHead({ title: "Solicitações Pharma — Vivka Admin", description: "Acompanhamento comercial das solicitações da Vivka Pharma.", path: "/admin/quiz", noindex: true });
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | "parcial" | "completo">("todos");
  const [openId, setOpenId] = useState<string | null>(null);
  const ready = useAdminGuard();

  function reload() {
    listLeads()
      .then(setLeads)
      .catch((e: Error) => setError(e.message ?? "Falha ao carregar"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (ready) reload();
  }, [ready]);

  const rows = (leads ?? []).filter((l) => filter === "todos" || l.status === filter);

  return (
    <AdminShell
      eyebrow="Vivka · Pharma"
      title="Solicitações & carrinhos abandonados"
      actions={
        <button type="button" onClick={reload} className="text-vk-tinta/70 hover:text-vk-azul">
          Atualizar
        </button>
      }
    >
            <div className="mb-6 flex flex-wrap gap-2">
              {(["todos", "parcial", "completo"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${filter === f ? "border-vk-azul bg-vk-azul text-vk-creme" : "border-vk-linha text-vk-tinta/70"}`}
                >
                  {f === "todos" ? "Todos" : f === "parcial" ? "Abandonados" : "Completos"}
                  {leads && <span className="ml-2 opacity-70">{f === "todos" ? leads.length : leads.filter((l) => l.status === f).length}</span>}
                </button>
              ))}
            </div>

            {loading && <p className="text-sm text-vk-tinta/60">Carregando…</p>}
            {error && <p className="text-sm text-vk-vinho">{error}</p>}
            {!loading && rows.length === 0 && <p className="text-sm text-vk-tinta/60">Nenhuma solicitação ainda.</p>}

            <div className="space-y-3">
              {rows.map((l) => (
                <div key={l.id} className="rounded-xl border border-vk-linha bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenId(openId === l.id ? null : l.id)}
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-left"
                  >
                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-widest ${l.status === "completo" ? "bg-vk-amarelo/50 text-vk-azul" : "bg-vk-vinho/10 text-vk-vinho"}`}>
                      {l.status === "completo" ? "Completo" : "Abandonado"}
                    </span>
                    <span className="font-medium text-vk-azul">{l.nome || "Sem nome"}</span>
                    <span className="text-sm text-vk-tinta/60">{l.email || "sem e-mail"}</span>
                    <span className="text-xs text-vk-tinta/60">
                      Etapa {l.last_step}/3 · {completude(l)}%
                    </span>
                    <span className="ml-auto text-xs text-vk-tinta/60">{fmtDate(l.created_at)}</span>
                    <span className={`rounded-full px-2 py-1 text-xs ${l.orcado ? "bg-vk-areia" : "bg-transparent text-vk-tinta/60"}`}>
                      {l.orcado ? `Orçado ${fmtMoney(l.valor_orcado)}` : "Sem orçamento"}
                    </span>
                    <span className="text-xs text-vk-tinta/60">
                      {l.aprovacao === "aprovado" ? "✓ Aprovado" : l.aprovacao === "recusado" ? "✕ Recusado" : "Pendente"}
                    </span>
                  </button>
                  {openId === l.id && <Detail lead={l} onSaved={reload} />}
                </div>
              ))}
            </div>
    </AdminShell>
  );
}

function Detail({ lead, onSaved }: { lead: Lead; onSaved: () => void }) {
  const [orcado, setOrcado] = useState(lead.orcado);
  const [valor, setValor] = useState(lead.valor_orcado != null ? String(lead.valor_orcado) : "");
  const [aprovacao, setAprovacao] = useState<Lead["aprovacao"]>(lead.aprovacao);
  const [vendedor, setVendedor] = useState(lead.vendedor ?? "");
  const [obs, setObs] = useState(lead.observacoes ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await updateLead(lead.id, {
        orcado,
        valor_orcado: valor.trim() === "" ? null : Number(valor.replace(",", ".")),
        aprovacao,
        vendedor: vendedor || null,
        observacoes: obs || null,
      });
      setMsg("Atualizado.");
      onSaved();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 border-t border-vk-linha px-5 py-5 md:grid-cols-2">
      <div className="space-y-1 text-sm">
        <h3 className="label-caps mb-2 text-vk-azul">Dados preenchidos</h3>
        <Info label="Nome" v={lead.nome} />
        <Info label="E-mail" v={lead.email} />
        <Info label="WhatsApp" v={lead.whatsapp} />
        <Info label="RG" v={lead.rg} />
        <Info label="CPF" v={lead.cpf} />
        <Info label="Nascimento" v={lead.data_nascimento} />
        <Info label="CEP" v={lead.cep} />
        <Info label="Endereço" v={[lead.logradouro, lead.numero, lead.complemento].filter(Boolean).join(", ")} />
        <Info label="Bairro" v={lead.bairro} />
        <Info label="Cidade/UF" v={lead.cidade ? `${lead.cidade}/${lead.uf ?? ""}` : null} />
        <Info label="Referência" v={lead.referencia} />
        <Info label="Frete" v={lead.frete === "sedex" ? "Sedex" : lead.frete === "pac" ? "PAC" : null} />
        <Info label="Receita" v={lead.prescription_type === "typed" ? "Fórmula digitada" : lead.prescription_file_path ? "Arquivo anexado" : null} />
        <div className="pt-3">
          <ReceitaAdmin
            path={lead.prescription_file_path}
            text={lead.prescription_type === "typed" ? lead.prescription_text : null}
            pedido={lead}
            sign={(path, download) => signUrl("prescriptions", path, download)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="label-caps text-vk-azul">Acompanhamento comercial</h3>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={orcado} onChange={(e) => setOrcado(e.target.checked)} className="h-4 w-4 accent-vk-azul" />
          Vendedor já orçou
        </label>
        <label className="block">
          <span className="label-caps text-vk-azul">Valor orçado (R$)</span>
          <input value={valor} onChange={(e) => setValor(e.target.value)} inputMode="decimal" className={inputAdmin} />
        </label>
        <label className="block">
          <span className="label-caps text-vk-azul">Aprovação do cliente</span>
          <select value={aprovacao} onChange={(e) => setAprovacao(e.target.value as Lead["aprovacao"])} className={inputAdmin}>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Não aprovado</option>
          </select>
        </label>
        <label className="block">
          <span className="label-caps text-vk-azul">Vendedor responsável</span>
          <input value={vendedor} onChange={(e) => setVendedor(e.target.value)} className={inputAdmin} />
        </label>
        <label className="block">
          <span className="label-caps text-vk-azul">Observações / histórico</span>
          <textarea rows={4} value={obs} onChange={(e) => setObs(e.target.value)} className={inputAdmin} />
        </label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={save} disabled={saving} className={btnAdmin}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
          {msg && <span className="text-xs text-vk-tinta/70">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

function Info({ label, v }: { label: string; v: string | null | undefined }) {
  return (
    <div className="flex gap-2">
      <span className="w-28 shrink-0 text-vk-tinta/60">{label}</span>
      <span className="break-words text-vk-tinta">{v && String(v).trim() ? v : "—"}</span>
    </div>
  );
}
