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

export type Preco = {
  qtd: "1" | "3" | "5";
  label: string;
  total: string;
  unidade: string;
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
      "Cromo picolinato, L-triptofano, Gymnema e Safron numa base de cacau: um pó para diluir em água logo após o almoço, pensado para o momento em que a vontade de doce costuma aparecer.",
    apresentacao: "150 g em pó",
    doses: "30 doses de 5 g",
    sabor: "Base de cacau",
    quando: "Logo após o almoço",
    modoUso: "Ingerir 5 g (1 dose) diluídos em 200 ml de água, logo após o almoço.",
    beneficios: ["Mais liberdade para escolher", "Menos doces por impulso", "Alimentação mais equilibrada"],
    ativosDestaque: [
      { nome: "Cromo picolinato", beneficio: "Mineral que participa do metabolismo dos carboidratos e da glicose." },
      { nome: "L-Triptofano", beneficio: "Aminoácido essencial, precursor da serotonina." },
      { nome: "Gymnema", beneficio: "Planta de uso tradicional, associada à percepção do sabor doce." },
      { nome: "Safron", beneficio: "Extrato do estigma do Crocus sativus, o açafrão-verdadeiro." },
    ],
    // TODO: confirmar a unidade do cromo picolinato (informado como 150 mg; o usual é mcg).
    composicao: [
      { nome: "Cromo picolinato", qtd: "150 mg" },
      { nome: "L-Triptofano", qtd: "100 mg" },
      { nome: "Gymnema", qtd: "100 mg" },
      { nome: "Safron", qtd: "30 mg" },
      { nome: "Cacau", qtd: "q.s.p. 1 dose" },
    ],
    precos: [
      { qtd: "1", label: "1 frasco", total: "116,90", unidade: "R$ 116,90 por frasco" },
      {
        qtd: "3",
        label: "3 frascos",
        total: "263,90",
        unidade: "R$ 87,97 por frasco",
        economia: "Economize R$ 86,80",
        destaque: "Mais vendido",
      },
      {
        qtd: "5",
        label: "5 frascos",
        total: "420,90",
        unidade: "R$ 84,18 por frasco",
        economia: "Economize R$ 163,60",
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
      "Inositol, magnésio bisglicinato, L-teanina e melatonina em um pó sabor laranja: para diluir em água à noite, 30 minutos antes de deitar, e acompanhar o seu descanso.",
    apresentacao: "150 g em pó",
    doses: "50 doses de 3 g",
    sabor: "Sabor laranja",
    quando: "30 minutos antes de deitar",
    modoUso: "Ingerir 3 g (1 dose) diluídos em 200 ml de água, à noite, 30 minutos antes de deitar.",
    beneficios: ["Relaxa a mente", "Sono mais profundo", "Mais equilíbrio para o dia"],
    ativosDestaque: [
      { nome: "Inositol", beneficio: "Composto naturalmente presente no organismo, da família das vitaminas do complexo B." },
      { nome: "Magnésio bisglicinato", beneficio: "Magnésio ligado à glicina: forma quelada e bem tolerada." },
      { nome: "L-Teanina", beneficio: "Aminoácido encontrado nas folhas do chá-verde." },
      { nome: "Melatonina", beneficio: "Substância produzida pelo próprio organismo, ligada ao ciclo do sono." },
    ],
    composicao: [
      { nome: "Inositol", qtd: "1.000 mg" },
      { nome: "Magnésio bisglicinato", qtd: "200 mg" },
      { nome: "L-Teanina", qtd: "120 mg" },
      { nome: "Melatonina", qtd: "250 mcg" },
      { nome: "Fresh Drink Laranja", qtd: "q.s." },
    ],
    precos: [
      { qtd: "1", label: "1 frasco", total: "123,90", unidade: "R$ 123,90 por frasco" },
      {
        qtd: "3",
        label: "3 frascos",
        total: "278,90",
        unidade: "R$ 92,97 por frasco",
        economia: "Economize R$ 92,80",
        destaque: "Mais vendido",
      },
      {
        qtd: "5",
        label: "5 frascos",
        total: "446,90",
        unidade: "R$ 89,38 por frasco",
        economia: "Economize R$ 172,60",
        destaque: "Melhor escolha",
      },
    ],
    image: "/products/night-card.webp",
    imageCutout: "/products/night-cutout.webp",
    imageAlt: "Vivka Night — pote de 150 g com rótulo azul-noite e dourado",
  },
};

// Kit Dia + Noite = Control + Night (preço = soma das faixas individuais)
// TODO: confirmar com o cliente se o kit terá preço próprio.
export const KIT_PRECOS: Preco[] = [
  { qtd: "1", label: "1 kit", total: "240,80", unidade: "1 Control + 1 Night" },
  {
    qtd: "3",
    label: "3 kits",
    total: "542,80",
    unidade: "3 Control + 3 Night",
    economia: "Economize R$ 179,60",
    destaque: "Mais vendido",
  },
  {
    qtd: "5",
    label: "5 kits",
    total: "867,80",
    unidade: "5 Control + 5 Night",
    economia: "Economize R$ 336,20",
    destaque: "Melhor escolha",
  },
];
