import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PHARMA_MARCA, PHARMA_SUPABASE_ANON_KEY, PHARMA_SUPABASE_URL } from "@/data/produtos";

/* ---------- Integração com o backend central Pharma (Supabase compartilhado por todas as marcas) ----------
   Mesmas operações da Bersch Health, feitas direto do navegador (o site é estático):
   - cliente: upload da receita, pedido, autosave do rascunho
   - admin: login, listar/atualizar pedidos e rascunhos, links assinados, comprovante                       */

export const pharmaBackendEnabled = Boolean(PHARMA_SUPABASE_URL && PHARMA_SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (!pharmaBackendEnabled) throw new Error("Backend Pharma não configurado (PHARMA_SUPABASE_URL / ANON_KEY).");
  if (!client) client = createClient(PHARMA_SUPABASE_URL, PHARMA_SUPABASE_ANON_KEY);
  return client;
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/* ---------- Tipos (espelham as tabelas do SQL) ---------- */
export type PrescriptionType = "upload" | "typed";
export type Frete = "pac" | "sedex";

export type PedidoInsert = {
  id?: string;
  prescription_type: PrescriptionType;
  prescription_file_path: string | null;
  prescription_text: string | null;
  nome: string;
  email: string;
  whatsapp: string | null;
  rg: string;
  cpf: string;
  data_nascimento: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  referencia: string | null;
  frete: Frete;
};

export type Pedido = PedidoInsert & {
  id: string;
  marca: string;
  created_at: string;
  updated_at: string;
  orcamento_valor: number | null;
  orcamento_status: "pendente" | "aprovado" | "nao_aprovado";
  valor_final: number | null;
  comprovante_path: string | null;
  comprovante_url: string | null;
  tracking_code: string | null;
  observacoes: string | null;
  status: string;
  notified_at: string | null;
};

export type LeadPayload = {
  session_id: string;
  last_step?: number;
  status?: "parcial" | "completo";
  prescription_type?: string | null;
  prescription_file_path?: string | null;
  prescription_text?: string | null;
  nome?: string;
  email?: string;
  whatsapp?: string;
  rg?: string;
  cpf?: string;
  data_nascimento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  referencia?: string;
  frete?: string;
};

export type Lead = {
  id: string;
  session_id: string;
  marca: string;
  created_at: string;
  updated_at: string;
  status: "parcial" | "completo";
  last_step: number;
  prescription_type: string | null;
  prescription_file_path: string | null;
  prescription_text: string | null;
  nome: string | null;
  email: string | null;
  whatsapp: string | null;
  rg: string | null;
  cpf: string | null;
  data_nascimento: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  referencia: string | null;
  frete: string | null;
  orcado: boolean;
  valor_orcado: number | null;
  aprovacao: "pendente" | "aprovado" | "recusado";
  vendedor: string | null;
  observacoes: string | null;
};

/* ---------- Cliente (formulário /pharma) ---------- */
export async function uploadPrescription(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${PHARMA_MARCA}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase().storage.from("prescriptions").upload(path, file, { contentType: file.type || undefined });
  if (error) {
    console.error("[pharma] upload failed", error);
    throw new Error("Não foi possível enviar o arquivo da receita. Verifique sua conexão e tente novamente.");
  }
  return path;
}

export async function createPedido(row: PedidoInsert): Promise<{ id: string }> {
  const id = row.id ?? newId();
  const { error } = await supabase()
    .from("pharma_pedidos")
    .insert({
      ...row,
      id,
      marca: PHARMA_MARCA,
      whatsapp: row.whatsapp || null,
      complemento: row.complemento || null,
      referencia: row.referencia || null,
      prescription_text: row.prescription_text || null,
      prescription_file_path: row.prescription_file_path || null,
    });
  if (error) {
    // 23505 = mesmo id já gravado (cliente reenviou após uma falha): o pedido já está salvo
    if (error.code === "23505") return { id };
    console.error("[pharma] insert failed", error);
    throw new Error("Não foi possível registrar sua solicitação. Tente novamente em instantes.");
  }
  return { id };
}

/** Autosave do rascunho (carrinho abandonado). Nunca lança: é melhor esforço. */
export async function saveQuizLead(payload: LeadPayload): Promise<void> {
  try {
    const { error } = await supabase().rpc("save_quiz_lead", { payload: { ...payload, marca: PHARMA_MARCA } });
    if (error) console.warn("[pharma] autosave failed", error.message);
  } catch (e) {
    console.warn("[pharma] autosave failed", e);
  }
}

/* ---------- Admin ---------- */
export async function getSession() {
  const { data } = await supabase().auth.getSession();
  return data.session;
}
export async function signIn(email: string, password: string) {
  const res = await supabase().auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  return res.error ? null : res.data.session;
}
export async function signOut() {
  await supabase().auth.signOut();
}

export async function listPedidos(): Promise<Pedido[]> {
  const { data, error } = await supabase()
    .from("pharma_pedidos")
    .select("*")
    .eq("marca", PHARMA_MARCA)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Pedido[];
}

export async function updatePedido(
  id: string,
  patch: Partial<Pick<Pedido, "orcamento_valor" | "orcamento_status" | "valor_final" | "tracking_code" | "observacoes" | "status">>,
) {
  const { error } = await supabase().from("pharma_pedidos").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Link temporário para ver/baixar um arquivo privado (só admin). `download` = nome do arquivo força "salvar". */
export async function signUrl(bucket: "prescriptions" | "comprovantes", path: string, download?: string, seconds = 600) {
  const { data, error } = await supabase()
    .storage.from(bucket)
    .createSignedUrl(path, seconds, download ? { download } : undefined);
  if (error) throw new Error(error.message);
  return data?.signedUrl ?? null;
}

export async function uploadComprovante(pedidoId: string, file: File) {
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${PHARMA_MARCA}/${pedidoId}/${Date.now()}.${ext}`;
  const { error } = await supabase().storage.from("comprovantes").upload(path, file);
  if (error) throw new Error(error.message);
  const url = await signUrl("comprovantes", path, undefined, 60 * 60 * 24 * 365 * 5);
  const { error: upErr } = await supabase().from("pharma_pedidos").update({ comprovante_path: path, comprovante_url: url }).eq("id", pedidoId);
  if (upErr) throw new Error(upErr.message);
  return url;
}

export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await supabase()
    .from("pharma_quiz_leads")
    .select("*")
    .eq("marca", PHARMA_MARCA)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Lead[];
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, "orcado" | "valor_orcado" | "aprovacao" | "vendedor" | "observacoes">>) {
  const { error } = await supabase().from("pharma_quiz_leads").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}
