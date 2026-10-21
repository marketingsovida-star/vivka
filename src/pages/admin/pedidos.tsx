import { useEffect, useState } from "react";
import { ReceitaAdmin } from "@/components/admin-receita";
import { AdminShell, btnAdmin, fmtDate, inputAdmin, useAdminGuard } from "@/components/admin-shell";
import { listPedidos, signUrl, updatePedido, uploadComprovante, type Pedido } from "@/lib/pharma-backend";
import { useHead } from "@/lib/head";

/* Pedidos Pharma (solicitações completas) — porte do admin.pharma-pedidos da Bersch. */
export function AdminPedidosPage() {
  useHead({ title: "Pedidos Pharma — Vivka Admin", description: "Gestão dos pedidos de manipulação da Vivka Pharma.", path: "/admin/pharma-pedidos", noindex: true });
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const ready = useAdminGuard();

  function reload() {
    setLoading(true);
    listPedidos()
      .then(setPedidos)
      .catch((e: Error) => setError(e.message ?? "Falha ao carregar"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (ready) reload();
  }, [ready]);

  return (
    <AdminShell
      eyebrow="Vivka · Admin"
      title="Pedidos Pharma"
      actions={
        <button type="button" onClick={reload} className="text-vk-tinta/70 hover:text-vk-azul">
          Atualizar
        </button>
      }
    >
      {error && <p className="mb-4 text-sm text-vk-vinho">{error}</p>}
      {loading && <p className="text-sm text-vk-tinta/60">Carregando…</p>}
      {!loading && pedidos && pedidos.length === 0 && <p className="text-sm text-vk-tinta/60">Nenhum pedido ainda.</p>}
      <div className="space-y-3">
        {pedidos?.map((p) => (
          <PedidoRow key={p.id} pedido={p} open={openId === p.id} onToggle={() => setOpenId(openId === p.id ? null : p.id)} onSaved={reload} />
        ))}
      </div>
    </AdminShell>
  );
}

function statusBadge(s: string) {
  const map: Record<string, string> = {
    aprovado: "bg-vk-amarelo/50 text-vk-azul",
    nao_aprovado: "bg-vk-vinho/15 text-vk-vinho",
    pendente: "bg-vk-areia text-vk-tinta",
  };
  const label: Record<string, string> = { aprovado: "Aprovado", nao_aprovado: "Não aprovado", pendente: "Pendente" };
  return <span className={`rounded-full px-2 py-0.5 text-xs ${map[s] ?? "bg-vk-areia"}`}>{label[s] ?? s}</span>;
}

function PedidoRow({ pedido, open, onToggle, onSaved }: { pedido: Pedido; open: boolean; onToggle: () => void; onSaved: () => void }) {
  const [orcamento, setOrcamento] = useState<string>(pedido.orcamento_valor?.toString() ?? "");
  const [status, setStatus] = useState<Pedido["orcamento_status"]>(pedido.orcamento_status ?? "pendente");
  const [valorFinal, setValorFinal] = useState<string>(pedido.valor_final?.toString() ?? "");
  const [tracking, setTracking] = useState<string>(pedido.tracking_code ?? "");
  const [obs, setObs] = useState<string>(pedido.observacoes ?? "");
  const [saving, setSaving] = useState(false);
  const [uploadingC, setUploadingC] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setOrcamento(pedido.orcamento_valor?.toString() ?? "");
    setStatus(pedido.orcamento_status ?? "pendente");
    setValorFinal(pedido.valor_final?.toString() ?? "");
    setTracking(pedido.tracking_code ?? "");
    setObs(pedido.observacoes ?? "");
  }, [pedido]);

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await updatePedido(pedido.id, {
        orcamento_valor: orcamento ? Number(orcamento.replace(",", ".")) : null,
        orcamento_status: status,
        valor_final: valorFinal ? Number(valorFinal.replace(",", ".")) : null,
        tracking_code: tracking || null,
        observacoes: obs || null,
      });
      setMsg("Salvo.");
      onSaved();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function enviarComprovante(file: File) {
    setUploadingC(true);
    setMsg(null);
    try {
      await uploadComprovante(pedido.id, file);
      onSaved();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploadingC(false);
    }
  }

  return (
    <div className="rounded-lg border border-vk-linha bg-white">
      <button type="button" onClick={onToggle} className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left">
        <div className="flex min-w-0 items-center gap-4">
          <span className="text-sm font-medium text-vk-azul">{pedido.nome}</span>
          <span className="truncate text-xs text-vk-tinta/60">{pedido.email}</span>
        </div>
        <div className="flex items-center gap-3">
          {statusBadge(pedido.orcamento_status ?? "pendente")}
          <span className="text-xs text-vk-tinta/60">{fmtDate(pedido.created_at)}</span>
        </div>
      </button>

      {open && (
        <div className="grid gap-4 border-t border-vk-linha p-4 md:grid-cols-2">
          <section className="space-y-3">
            <h3 className="label-caps text-vk-azul">Gestão do orçamento</h3>
            <label className="block">
              <span className="text-xs text-vk-tinta/60">Valor do orçamento (R$)</span>
              <input type="number" step="0.01" value={orcamento} onChange={(e) => setOrcamento(e.target.value)} className={inputAdmin} />
            </label>
            <label className="block">
              <span className="text-xs text-vk-tinta/60">Situação</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as Pedido["orcamento_status"])} className={inputAdmin}>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="nao_aprovado">Não aprovado</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-vk-tinta/60">Valor final pago (R$)</span>
              <input type="number" step="0.01" value={valorFinal} onChange={(e) => setValorFinal(e.target.value)} className={inputAdmin} />
            </label>
            <label className="block">
              <span className="text-xs text-vk-tinta/60">Código de rastreio</span>
              <input value={tracking} onChange={(e) => setTracking(e.target.value)} className={inputAdmin} />
            </label>
            <label className="block">
              <span className="text-xs text-vk-tinta/60">Observações internas</span>
              <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} className={inputAdmin} />
            </label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={save} disabled={saving} className={btnAdmin}>
                {saving ? "Salvando…" : "Salvar"}
              </button>
              {msg && <span className="text-xs text-vk-tinta/70">{msg}</span>}
            </div>

            <div className="border-t border-vk-linha pt-3">
              <h4 className="label-caps mb-2 text-vk-azul">Comprovante de pagamento</h4>
              {pedido.comprovante_url && (
                <a href={pedido.comprovante_url} target="_blank" rel="noreferrer" className="text-sm text-vk-azul underline">
                  Ver comprovante
                </a>
              )}
              <label className="mt-2 block">
                <span className="text-xs text-vk-tinta/60">{pedido.comprovante_url ? "Substituir arquivo" : "Enviar arquivo"}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  disabled={uploadingC}
                  onChange={(e) => e.target.files?.[0] && enviarComprovante(e.target.files[0])}
                  className="mt-1 block text-sm"
                />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h3 className="label-caps mb-2 text-vk-azul">Receita do cliente</h3>
              <ReceitaAdmin
                path={pedido.prescription_type === "upload" ? pedido.prescription_file_path : null}
                text={pedido.prescription_type === "typed" ? pedido.prescription_text : null}
                pedido={pedido}
                sign={(path, download) => signUrl("prescriptions", path, download)}
              />
            </div>
            <div>
              <h3 className="label-caps mb-2 text-vk-azul">Contato</h3>
              <div className="space-y-0.5 text-sm">
                <div>
                  <b>E-mail:</b> {pedido.email}
                </div>
                <div>
                  <b>WhatsApp:</b> {pedido.whatsapp ?? "—"}
                </div>
              </div>
            </div>
            <div>
              <h3 className="label-caps mb-2 text-vk-azul">Documentos</h3>
              <div className="space-y-0.5 text-sm">
                <div>
                  <b>RG:</b> {pedido.rg}
                </div>
                <div>
                  <b>CPF:</b> {pedido.cpf}
                </div>
                <div>
                  <b>Nascimento:</b> {pedido.data_nascimento}
                </div>
              </div>
            </div>
            <div>
              <h3 className="label-caps mb-2 text-vk-azul">Endereço</h3>
              <div className="text-sm">
                {pedido.logradouro}, {pedido.numero}
                {pedido.complemento ? ` — ${pedido.complemento}` : ""}
                <br />
                {pedido.bairro} — {pedido.cidade}/{pedido.uf} — CEP {pedido.cep}
                <br />
                {pedido.referencia && <span className="text-vk-tinta/60">Ref.: {pedido.referencia}</span>}
              </div>
            </div>
            <div>
              <h3 className="label-caps mb-2 text-vk-azul">Envio</h3>
              <div className="text-sm">{pedido.frete === "pac" ? "PAC — R$ 22,50" : "Sedex — R$ 37,50"}</div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
