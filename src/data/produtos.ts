/* ---------- Vivka — dados dos produtos, preços e contato ---------- */

// TODO: trocar pelo domínio final quando a hospedagem estiver definida.
export const BASE_URL = "https://vivka.com.br";

/** Prefixa um caminho de /public com a base do Vite (ex.: "/vivka/" no GitHub Pages; "/" em domínio próprio). */
export const asset = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${p}`;

// TODO: número do WhatsApp da Vivka (DDI + DDD + número, só dígitos).
export const WHATSAPP_NUMBER = "5500000000000";
export const WHATSAPP_DISPLAY = "(00) 00000-0000";

export const whatsappUrl = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* ---------- SAC (página /sac) ---------- */
// TODO: e-mail que recebe os chamados (usado no fallback por e-mail e no texto da página).
export const SAC_EMAIL = "sac@vivka.com.br";
// Endpoint de formulário (Formspree, Web3Forms ou similar — aceita POST multipart com anexos).
// Vazio = sem backend: o formulário abre o e-mail do cliente já preenchido (sem anexos).
export const SAC_FORM_ENDPOINT = "";

/* ---------- Pharma (página /pharma e seção Pharma) ---------- */
// TODO: e-mail que recebe as solicitações de manipulação.
export const PHARMA_EMAIL = "pharma@vivka.com.br";
// Endpoint de formulário (Formspree, Web3Forms ou similar — aceita POST multipart com a receita anexada).
// Vazio = sem backend: o modal abre o e-mail do cliente já preenchido (a receita é anexada à mão).
export const PHARMA_FORM_ENDPOINT = "";
export const PHARMA_OPCOES = ["Sua fórmula prescrita", "Sua fórmula personalizada", "Orçamento de manipulação"];

/* Backend central Pharma (Supabase compartilhado por todas as marcas — ver repo pharma-backend).
   Com URL e chave preenchidas, o formulário grava pedidos/rascunhos no banco e o /admin funciona;
   vazio = fallback por e-mail (PHARMA_FORM_ENDPOINT / mailto). */
export const PHARMA_SUPABASE_URL = "";
export const PHARMA_SUPABASE_ANON_KEY = "";
/** Identificador desta marca no backend central (= marcas.slug). */
export const PHARMA_MARCA = "vivka";

/** Aviso obrigatório exibido abaixo do modo de uso (texto do rótulo). */
export const AVISO_USO =
  "Não exceder a recomendação diária de consumo indicada na embalagem. Este produto não é um medicamento.";

export type Preco = {
  qtd: "1" | "2" | "3" | "4" | "5";
  label: string;
  total: string;
  unidade: string;
  /** Maior parcelamento no checkout da Payt (ex.: "12x de R$ 14,47"). */
  parcela: string;
  /** Link do checkout da Payt. */
  link: string;
  economia?: string;
  destaque?: "Mais vendido" | "Melhor escolha";
};

export type ItemComposicao = { nome: string; qtd: string };

export type ProdutoId = "control" | "night";

export type Produto = {
  id: ProdutoId;
  slug: string;
  nome: string;
  /** Cor de expressão do produto no MIV. */
  cor: "amarelo" | "azul";
  momento: "tarde" | "noite";
  momentoLabel: string; // "Para a sua tarde"
  tagline: string; // frase do rótulo
  frase: string; // frase do MIV (p.6)
  descricao: string;
  apresentacao: string; // "150 g em pó"
  doses: string; // "30 doses de 5 g"
  sabor: string;
  quando: string; // "Logo após o almoço"
  modoUso: string;
  beneficios: string[];
  ativosDestaque: { nome: string; beneficio: string }[];
  composicao: ItemComposicao[];
  precos: Preco[];
  image: string;
  imageCutout: string;
  imageAlt: string;
};

export const PRODUTOS: Record<ProdutoId, Produto> = {
  control: {
    id: "control",
    slug: "/control",
    nome: "Control",
    cor: "amarelo",
    momento: "tarde",
    momentoLabel: "Para a sua tarde",
    tagline: "Controle da vontade de doces à tarde.",
    frase: "Quando o doce chama, você escolhe.",
    descricao:
      "Cromo picolinato, L-triptofano, Gymnema e Saffron numa base de cacau: um pó para diluir em água logo após o almoço, pensado para o momento em que a vontade de doce costuma aparecer.",
    apresentacao: "150 g em pó",
    doses: "30 doses de 5 g",
    sabor: "Base de cacau",
    quando: "Logo após o almoço",
    modoUso: "Ingerir 5 g (1 dose) diluídos em 200 ml de água, logo após o almoço, ou conforme orientação profissional.",
    beneficios: ["Mais liberdade para escolher", "Menos doces por impulso", "Alimentação mais equilibrada"],
    ativosDestaque: [
      { nome: "Cromo picolinato", beneficio: "Mineral que participa do metabolismo dos carboidratos e da glicose." },
      { nome: "L-Triptofano", beneficio: "Aminoácido essencial, precursor da serotonina." },
      { nome: "Gymnema", beneficio: "Planta de uso tradicional, associada à percepção do sabor doce." },
      { nome: "Saffron", beneficio: "Extrato do estigma do Crocus sativus, o açafrão-verdadeiro." },
    ],
    // Composição por dose conforme o rótulo (2026-10-15).
    composicao: [
      { nome: "Cromo picolinato", qtd: "150 mcg" },
      { nome: "L-Triptofano", qtd: "100 mg" },
      { nome: "Gymnema", qtd: "100 mg" },
      { nome: "Saffron", qtd: "30 mg" },
      { nome: "Cacau", qtd: "q.s.p. 1 dose" },
    ],
    precos: [
      {
        qtd: "1",
        label: "1 pote",
        total: "139,90",
        unidade: "R$ 139,90 por pote",
        parcela: "12x de R$ 14,47",
        link: "https://payt.site/2DC7G8E",
      },
      {
        qtd: "3",
        label: "3 potes",
        total: "379,89",
        unidade: "R$ 126,63 por pote",
        parcela: "12x de R$ 39,29",
        link: "https://payt.site/zZC7rJv",
        economia: "Economize R$ 39,81",
        destaque: "Mais vendido",
      },
      {
        qtd: "5",
        label: "5 potes",
        total: "589,90",
        unidade: "R$ 117,98 por pote",
        parcela: "12x de R$ 61,01",
        link: "https://payt.site/R5CnMKk",
        economia: "Economize R$ 109,60",
        destaque: "Melhor escolha",
      },
    ],
    image: "/products/control-card.webp",
    imageCutout: "/products/control-cutout.webp",
    imageAlt: "Vivka Control — pote de 150 g com rótulo amarelo e azul",
  },
  night: {
    id: "night",
    slug: "/night",
    nome: "Night",
    cor: "azul",
    momento: "noite",
    momentoLabel: "Para a sua noite",
    tagline: "Suporte ao sono para noites melhores.",
    frase: "Quando a noite chega, você descansa.",
    descricao:
      "Inositol, melatonina, magnésio bisglicinato e L-theanina em um pó sabor laranja: para diluir em água à noite, 30 minutos antes de deitar, e acompanhar o seu descanso.",
    apresentacao: "150 g em pó",
    doses: "30 doses de 5 g",
    sabor: "Sabor laranja",
    quando: "30 minutos antes de deitar",
    modoUso: "Ingerir 5 g (1 dose) diluídos em 200 ml de água, à noite, 30 minutos antes de deitar.",
    beneficios: ["Relaxa a mente", "Sono mais profundo", "Mais equilíbrio para o dia"],
    ativosDestaque: [
      { nome: "Inositol", beneficio: "Composto naturalmente presente no organismo, da família das vitaminas do complexo B." },
      { nome: "Melatonina", beneficio: "Substância produzida pelo próprio organismo, ligada ao ciclo do sono." },
      { nome: "Magnésio bisglicinato", beneficio: "Magnésio ligado à glicina: forma quelada e bem tolerada." },
      { nome: "L-Theanina", beneficio: "Aminoácido encontrado nas folhas do chá-verde." },
    ],
    // Composição por dose conforme o rótulo (2026-10-15).
    composicao: [
      { nome: "Inositol", qtd: "1.000 mg" },
      { nome: "Melatonina", qtd: "250 mcg" },
      { nome: "Magnésio bisglicinato", qtd: "200 mg" },
      { nome: "L-Theanina", qtd: "120 mg" },
      { nome: "Fresh Drink Laranja", qtd: "q.s." },
    ],
    precos: [
      {
        qtd: "1",
        label: "1 pote",
        total: "149,90",
        unidade: "R$ 149,90 por pote",
        parcela: "12x de R$ 15,50",
        link: "https://payt.site/DdC9AaG",
      },
      {
        qtd: "3",
        label: "3 potes",
        total: "398,88",
        unidade: "R$ 132,96 por pote",
        parcela: "12x de R$ 41,25",
        link: "https://payt.site/mNCDM2q",
        economia: "Economize R$ 50,82",
        destaque: "Mais vendido",
      },
      {
        qtd: "5",
        label: "5 potes",
        total: "579,90",
        unidade: "R$ 115,98 por pote",
        parcela: "12x de R$ 59,98",
        link: "https://payt.site/qZCwqBp",
        economia: "Economize R$ 169,60",
        destaque: "Melhor escolha",
      },
    ],
    image: "/products/night-card.webp",
    imageCutout: "/products/night-cutout.webp",
    imageAlt: "Vivka Night — pote de 150 g com rótulo azul-noite e dourado",
  },
};

// Kit Dia + Noite = pares Control + Night (economia calculada sobre os potes avulsos)
export const KIT_PRECOS: Preco[] = [
  {
    qtd: "1",
    label: "1 par",
    total: "279,90",
    unidade: "1 Control + 1 Night",
    parcela: "12x de R$ 28,95",
    link: "https://payt.site/R5CnMNZ",
    economia: "Economize R$ 9,90",
  },
  {
    qtd: "2",
    label: "2 pares",
    total: "519,90",
    unidade: "2 Control + 2 Night",
    parcela: "12x de R$ 53,77",
    link: "https://payt.site/JBCayvd",
    economia: "Economize R$ 59,70",
    destaque: "Mais vendido",
  },
  {
    qtd: "4",
    label: "4 pares",
    total: "998,88",
    unidade: "4 Control + 4 Night",
    parcela: "12x de R$ 103,31",
    link: "https://payt.site/lwCermO",
    economia: "Economize R$ 160,32",
    destaque: "Melhor escolha",
  },
];
