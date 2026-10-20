import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Candy, Check, MoonStar, Plus, ShieldCheck, SunMoon, Truck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BTN, Eyebrow, Footer, HeaderRow, SiteHeader, THEME } from "@/components/vivka-ui";
import { PRODUTOS, KIT_PRECOS, asset, type Preco, type Produto } from "@/data/produtos";
import { useHead } from "@/lib/head";

const DESC =
  "A loja oficial Vivka: Control para a tarde, Night para a noite e o kit Dia + Noite com os dois juntos. Compra segura pela Payt, em até 12x.";

const MARQUEE = ["Em pó, diluído na água", "Um para cada momento", "Fórmula declarada", "Cacau e laranja", "7 dias de garantia", "Até 12x no cartão"];

/* Véu do lado do texto. Nas fotos de produto o pote começa em ~56% da largura, então o véu
   termina antes disso; no banner do kit (potes mais à direita) ele vai até 62%, como na home. */
const VEIL_LIGHT =
  "linear-gradient(to right, rgba(255,249,238,0.97) 0%, rgba(255,249,238,0.9) 30%, rgba(255,249,238,0.4) 44%, rgba(255,249,238,0) 56%)";
const VEIL_DARK =
  "linear-gradient(to right, rgba(11,29,58,0.97) 0%, rgba(11,29,58,0.9) 30%, rgba(11,29,58,0.4) 44%, rgba(11,29,58,0) 56%)";
const VEIL_KIT =
  "linear-gradient(to right, rgba(255,249,238,0.97) 0%, rgba(255,249,238,0.9) 30%, rgba(255,249,238,0.45) 48%, rgba(255,249,238,0) 62%)";

type Slide = {
  id: string;
  dark: boolean;
  img: string;
  imgMobile: string;
  veil: string;
  tag: string;
  titulo: React.ReactNode;
  sub: string;
  cta: string;
};

const SLIDES: Slide[] = [
  {
    id: "control",
    dark: false,
    img: "/photos/banner-loja-control.webp",
    imgMobile: "/photos/banner-loja-control.webp",
    veil: VEIL_LIGHT,
    tag: "Para a sua tarde",
    titulo: (
      <>
        Quando o doce chama, <span className="mark-dia">você escolhe.</span>
      </>
    ),
    sub: "Cromo picolinato, L-triptofano, Gymnema e Saffron numa base de cacau. Uma dose em 200 ml de água, logo após o almoço.",
    cta: "Comprar Control",
  },
  {
    id: "night",
    dark: true,
    img: "/photos/banner-loja-night.webp",
    imgMobile: "/photos/banner-loja-night.webp",
    veil: VEIL_DARK,
    tag: "Para a sua noite",
    titulo: (
      <>
        Quando a noite chega, <span className="text-vk-dourado">você descansa.</span>
      </>
    ),
    sub: "Inositol, melatonina, magnésio bisglicinato e L-theanina, sabor laranja. Uma dose em 200 ml de água, 30 minutos antes de deitar.",
    cta: "Comprar Night",
  },
  {
    id: "kit",
    dark: false,
    img: "/photos/hero-banner.webp",
    imgMobile: "/photos/hero-banner.webp",
    veil: VEIL_KIT,
    tag: "Kit Dia + Noite",
    titulo: <>Vivka une os dois momentos.</>,
    sub: "Control e Night juntos, com a mesma assinatura e economia maior nos kits de 2 e 4 pares.",
    cta: "Montar meu kit",
  },
];

const DIFERENCIAIS = [
  { n: "01", t: "Um para cada momento", d: "Control logo após o almoço, Night antes de deitar. Cada produto cuida de uma hora do dia, sem promessas genéricas." },
  { n: "02", t: "Você sabe o que toma", d: "Ativos e quantidades por dose apresentados de forma clara, no rótulo e no site, para uma escolha consciente." },
  { n: "03", t: "Em pó, na água", d: "Nada de contar cápsulas: uma dose, 200 ml de água e pronto. Base de cacau à tarde, sabor laranja à noite." },
  { n: "04", t: "Garantia de 7 dias", d: "Você testa com tranquilidade. Se não ficar satisfeito, nosso SAC orienta a devolução. Entrega para todo o Brasil." },
];

const FAQS = [
  {
    q: "Como devo usar os produtos?",
    a: "Control: 5 g (1 dose) diluídos em 200 ml de água, logo após o almoço, ou conforme orientação profissional. Night: 5 g (1 dose) diluídos em 200 ml de água, à noite, 30 minutos antes de deitar. Não exceda a recomendação diária indicada na embalagem.",
  },
  {
    q: "Qual a diferença entre o Control e o Night?",
    a: "O Control é para a tarde: cromo picolinato, L-triptofano, Gymnema e Saffron numa base de cacau, para o momento em que a vontade de doce costuma aparecer. O Night é para a noite: inositol, melatonina, magnésio bisglicinato e L-theanina, sabor laranja, para acompanhar o seu descanso.",
  },
  {
    q: "Posso usar os dois no mesmo dia?",
    a: "Sim. Eles foram pensados como um par: o Control acompanha a sua tarde e o Night, a sua noite. O kit Dia + Noite traz os dois juntos.",
  },
  {
    q: "Quantas doses tem cada pote?",
    a: "Os dois vêm em potes de 150 g e rendem 30 doses de 5 g cada: um mês de uso diário.",
  },
  {
    q: "Como funciona a compra?",
    a: "A compra é feita pelo nosso checkout seguro (Payt). Escolha a quantidade, clique em Comprar e finalize o pagamento. No cartão, você pode parcelar em até 12x.",
  },
  {
    q: "Como funciona a garantia?",
    a: "Você tem 7 dias para testar. Se não ficar satisfeito, abra um chamado no nosso SAC e orientamos a devolução.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const parseBRL = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));
const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function LojaPage() {
  useHead({
    title: "Loja Vivka — Control, Night e Kit Dia + Noite",
    description: DESC,
    path: "/loja",
    ogImage: "/og-image.jpg",
    jsonLd: faqJsonLd,
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-vk-creme text-vk-tinta">
      <div
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          stuck ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
        }`}
        aria-hidden={!stuck}
      >
        <SiteHeader />
      </div>
      <main>
        <div ref={heroRef}>
          <HeroCarousel />
        </div>
        {/* No mobile/tablet a faixa fica no fluxo normal; no desktop ela sobrepõe a base do banner (ver HeroCarousel) */}
        <div className="lg:hidden">
          <Marquee />
        </div>
        <Vitrine />
        <Comprar />
        <Diferenciais />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- HERO CARROSSEL (3 banners: Control, Night, Kit) ---------- */
function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);
  const dark = SLIDES[active].dark;

  return (
    <section className="relative overflow-hidden border-b border-vk-linha bg-vk-creme">
      {/* DESKTOP — banner igual ao da home (imagem de fundo + véu do lado do texto) */}
      <div className="relative hidden h-[904px] lg:block">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{ backgroundImage: `url('${asset(s.img)}')`, backgroundPosition: "right center" }}
              aria-hidden="true"
            />
            <div className="absolute inset-0" style={{ background: s.veil }} aria-hidden="true" />
            <div className="relative mx-auto flex h-full max-w-7xl flex-col px-6 pb-24 pt-7 md:px-10">
              <div className={`border-b pb-5 ${s.dark ? "border-vk-creme/20" : "border-vk-azul/15"}`}>
                <HeaderRow dark={s.dark} />
              </div>
              <div className="flex flex-1 items-center py-12">
                <div className="w-full max-w-xl">
                  <Eyebrow rule={s.dark ? "bg-vk-dourado" : "bg-vk-dourado"} className={s.dark ? "text-vk-dourado" : "text-vk-azul"}>
                    {s.tag}
                  </Eyebrow>
                  <h1 className={`mt-6 text-5xl font-medium leading-[1.08] md:text-6xl lg:text-[4.4rem] ${s.dark ? "text-vk-creme" : "text-vk-azul"}`}>
                    {s.titulo}
                  </h1>
                  <p className={`mt-7 max-w-lg text-base leading-7 md:text-lg md:leading-8 ${s.dark ? "text-vk-creme/80" : "text-vk-tinta/80"}`}>
                    {s.sub}
                  </p>
                  <div className="mt-9">
                    <a href="#comprar" className={`group ${s.dark ? BTN.gold : BTN.primary}`}>
                      {s.cta}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE / TABLET — texto em cima, imagem embaixo, sem véu (igual à home) */}
      <div className="lg:hidden">
        {SLIDES.map((s, i) => (
          <div key={s.id} className={`${i === active ? "block" : "hidden"} ${s.dark ? "bg-vk-azul" : "bg-vk-creme"}`}>
            <div className="mx-auto max-w-7xl px-6 pb-12 pt-6 md:px-10">
              <div className={`border-b pb-5 ${s.dark ? "border-vk-creme/20" : "border-vk-azul/15"}`}>
                <HeaderRow dark={s.dark} />
              </div>
              <div className="py-8">
                <Eyebrow className={s.dark ? "text-vk-dourado" : "text-vk-azul"}>{s.tag}</Eyebrow>
                <h1 className={`mt-6 text-5xl font-medium leading-[1.08] ${s.dark ? "text-vk-creme" : "text-vk-azul"}`}>{s.titulo}</h1>
                <p className={`mt-6 text-base leading-7 ${s.dark ? "text-vk-creme/80" : "text-vk-tinta/80"}`}>{s.sub}</p>
                <div className="mt-8">
                  <a href="#comprar" className={`group w-full ${s.dark ? BTN.gold : BTN.primary}`}>
                    {s.cta}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className={`overflow-hidden rounded-3xl border ${s.dark ? "border-vk-dourado/40" : "border-vk-linha"}`}>
                <img src={asset(s.imgMobile)} alt={`Vivka — ${s.tag}`} className="w-full object-cover" />
              </div>
              <Dots active={active} dark={s.dark} onPick={setActive} className="mt-6 flex justify-center gap-2" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: bolinhas + faixa sobrepostas à base do banner, encostadas na borda inferior da primeira tela
          (o banner em si não muda: 904 px). top = clamp(mín 720px, 100vh - 64px, máx 840px) — 64 = bolinhas + faixa. */}
      <div className="absolute inset-x-0 z-10 hidden lg:block" style={{ top: "clamp(720px, calc(100vh - 64px), 840px)" }}>
        <Dots active={active} dark={dark} onPick={setActive} className="mb-3 flex justify-center gap-2" />
        <Marquee />
      </div>
    </section>
  );
}

function Dots({ active, dark, onPick, className }: { active: number; dark: boolean; onPick: (i: number) => void; className: string }) {
  return (
    <div className={className}>
      {SLIDES.map((sl, i) => (
        <button
          key={sl.id}
          type="button"
          onClick={() => onPick(i)}
          aria-label={`Banner ${i + 1}`}
          className={`h-2 rounded-full transition-all ${
            i === active ? (dark ? "w-6 bg-vk-dourado" : "w-6 bg-vk-azul") : dark ? "w-2 bg-vk-creme/40" : "w-2 bg-vk-azul/30"
          }`}
        />
      ))}
    </div>
  );
}

/* ---------- MARQUEE (dourado sobre azul) ---------- */
function Marquee() {
  const items = [...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-b border-vk-linha bg-vk-azul py-3">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="label-caps flex items-center gap-8 text-vk-dourado">
            {t} <span className="h-1 w-1 rounded-full bg-vk-dourado/60" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- VITRINE (1 pote de cada) ---------- */
function Vitrine() {
  return (
    <section className="bg-vk-creme px-6 py-18 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow center className="text-vk-azul">
            Potes avulsos
          </Eyebrow>
          <h2 className="mt-3 text-4xl font-medium text-vk-azul md:text-5xl">Comece com um pote.</h2>
          <p className="mt-5 text-base leading-7 text-vk-tinta/70">
            Prefere experimentar? Leve um pote do produto que combina com o seu momento.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <VitrineCard produto={PRODUTOS.control} />
          <VitrineCard produto={PRODUTOS.night} />
        </div>
      </div>
    </section>
  );
}

function VitrineCard({ produto }: { produto: Produto }) {
  const t = THEME[produto.id];
  const Icon = produto.id === "control" ? Candy : MoonStar;
  const p = produto.precos[0];
  return (
    <Reveal className="flex flex-col items-center gap-6 rounded-3xl border border-vk-linha bg-white p-6 text-center shadow-[var(--shadow-card)] sm:flex-row sm:text-left md:p-8">
      <img src={asset(`/products/${produto.id}-1.webp`)} alt={`Vivka ${produto.nome}`} className="h-36 w-auto shrink-0 object-contain" />
      <div className="flex-1">
        <Eyebrow rule={t.dot} className="justify-center text-vk-azul sm:justify-start">
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4" aria-hidden="true" /> {produto.momentoLabel}
          </span>
        </Eyebrow>
        <h3 className="mt-2 text-2xl font-medium text-vk-azul">
          Vivka <span className={t.mark}>{produto.nome}</span>
        </h3>
        <p className="label-caps mt-2 text-vk-tinta/55">
          {produto.apresentacao} · {produto.doses} · {produto.sabor}
        </p>
        <div className="mt-4 flex items-baseline justify-center gap-1 sm:justify-start">
          <span className="text-sm text-vk-tinta/60">R$</span>
          <span className="font-display text-4xl font-medium text-vk-azul">{p.total}</span>
          <span className="ml-1 text-sm text-vk-tinta/60">/ pote</span>
        </div>
        <p className="mt-1 text-sm text-vk-tinta/70">ou {p.parcela}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a href={p.link} target="_blank" rel="noreferrer" className={`flex-1 ${BTN.primary} min-h-11 px-5`}>
            Comprar 1 pote
          </a>
          <Link to={produto.slug} className={`${BTN.outline} min-h-11 px-5`}>
            Ver detalhes
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- COMPRAR (seletor de quantidade) ---------- */
function Comprar() {
  return (
    <section id="comprar" className="scroll-mt-20 border-y border-vk-linha bg-vk-areia px-6 py-18 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow center className="text-vk-azul">
            Escolha a quantidade
          </Eyebrow>
          <h2 className="mt-3 text-4xl font-medium text-vk-azul md:text-5xl">Quanto mais, mais em conta.</h2>
        </Reveal>
        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          <LojaCard
            tag={PRODUTOS.control.momentoLabel}
            icon={Candy}
            accent="control"
            nome="Control"
            imagePrefix="control"
            meta={`${PRODUTOS.control.apresentacao} · ${PRODUTOS.control.doses} · ${PRODUTOS.control.sabor}`}
            precos={PRODUTOS.control.precos}
            unidade={["pote", "potes"]}
          />
          <LojaCard
            tag="Kit Dia + Noite"
            icon={SunMoon}
            nome="Dia + Noite"
            sub="Control + Night"
            imagePrefix="kit"
            meta="1 Control 150 g + 1 Night 150 g por par"
            precos={KIT_PRECOS}
            unidade={["par", "pares"]}
            baseUnit={parseBRL(PRODUTOS.control.precos[0].total) + parseBRL(PRODUTOS.night.precos[0].total)}
            featured
          />
          <LojaCard
            tag={PRODUTOS.night.momentoLabel}
            icon={MoonStar}
            accent="night"
            nome="Night"
            imagePrefix="night"
            meta={`${PRODUTOS.night.apresentacao} · ${PRODUTOS.night.doses} · ${PRODUTOS.night.sabor}`}
            precos={PRODUTOS.night.precos}
            unidade={["pote", "potes"]}
          />
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-vk-tinta/60">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-vk-azul" aria-hidden="true" /> Compra segura
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-vk-azul" aria-hidden="true" /> Entrega para todo o Brasil
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-vk-azul" aria-hidden="true" /> Garantia de 7 dias
          </span>
        </div>
      </div>
    </section>
  );
}

function LojaCard({
  tag,
  icon: Icon,
  accent,
  nome,
  sub,
  imagePrefix,
  meta,
  precos,
  unidade,
  baseUnit,
  featured = false,
}: {
  tag: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  accent?: "control" | "night";
  nome: string;
  sub?: string;
  imagePrefix: string;
  meta: string;
  precos: Preco[];
  unidade: [string, string];
  /** Preço de referência por unidade (default: o da 1ª faixa) — no kit, a soma dos potes avulsos. */
  baseUnit?: number;
  featured?: boolean;
}) {
  const [i, setI] = useState(precos.length > 1 ? 1 : 0);
  const p = precos[i];
  const qty = Number(p.qtd);
  const unit1 = baseUnit ?? parseBRL(precos[0].total);
  const totalNum = parseBRL(p.total);
  const original = unit1 * qty;
  const perUnit = totalNum / qty;
  const label = `${p.qtd} ${qty === 1 ? unidade[0] : unidade[1]}`;
  const dot = accent ? THEME[accent].dot : "bg-vk-dourado";
  const mark = accent ? THEME[accent].mark : "mark-noite";

  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-[var(--shadow-card)] md:p-7 ${
        featured ? "border-vk-azul ring-4 ring-vk-dourado/35" : "border-vk-linha"
      }`}
    >
      {featured && (
        <span className="label-caps absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-vk-amarelo px-4 py-1 text-[11px] text-vk-azul">
          Mais escolhido
        </span>
      )}
      <Eyebrow rule={dot} className="text-vk-azul">
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4" aria-hidden={true} /> {tag}
        </span>
      </Eyebrow>

      <div className="mt-4 flex h-40 items-center justify-center">
        <img src={asset(`/products/${imagePrefix}-${p.qtd}.webp`)} alt={`Vivka ${nome} — ${label}`} className="max-h-40 w-auto max-w-full object-contain" />
      </div>

      <h3 className="mt-4 text-2xl font-medium text-vk-azul">
        Vivka <span className={mark}>{nome}</span>
      </h3>
      {sub && <p className="mt-1 text-sm text-vk-tinta/70">{sub}</p>}
      <p className="label-caps mt-2 text-vk-tinta/55">{meta}</p>

      <div className="mt-5">
        <span className="label-caps text-vk-azul">Escolha a quantidade</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {precos.map((tier, idx) => (
            <button
              key={tier.qtd}
              type="button"
              onClick={() => setI(idx)}
              className={`min-h-10 rounded-full border px-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-vk-dourado ${
                i === idx ? "border-vk-azul bg-vk-azul text-vk-creme" : "border-vk-linha text-vk-tinta hover:bg-vk-areia"
              }`}
            >
              {tier.qtd} {Number(tier.qtd) === 1 ? unidade[0] : unidade[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="my-5 border-y border-vk-linha py-5">
        {original > totalNum + 0.005 && <p className="text-sm text-vk-tinta/50 line-through">R$ {fmtBRL(original)}</p>}
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-vk-tinta/60">R$</span>
          <span className="font-display text-5xl font-medium text-vk-azul">{p.total}</span>
        </div>
        <p className="mt-1 text-sm text-vk-tinta/70">ou {p.parcela}</p>
        <p className="mt-2 text-sm text-vk-tinta/60">
          R$ {fmtBRL(perUnit)} por {unidade[0]}
        </p>
        {p.economia && <p className="mt-1 text-xs font-semibold text-vk-azul">{p.economia}</p>}
      </div>

      <a href={p.link} target="_blank" rel="noreferrer" className={`mt-auto ${featured ? BTN.primary : BTN.outline}`}>
        Comprar — R$ {p.total}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-center text-[11px] text-vk-tinta/50">Checkout seguro Payt · até 12x no cartão</p>
    </div>
  );
}

/* ---------- DIFERENCIAIS ---------- */
function Diferenciais() {
  return (
    <section className="px-6 py-18 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow center className="text-vk-azul">
            Por que Vivka
          </Eyebrow>
          <h2 className="mt-3 text-4xl font-medium text-vk-azul md:text-5xl">Simples de entender. Simples de usar.</h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-vk-linha bg-vk-linha md:grid-cols-2">
          {DIFERENCIAIS.map(({ n, t, d }, idx) => (
            <Reveal key={n} delay={((idx % 4) + 1) as 1 | 2 | 3 | 4} className="bg-vk-creme p-8 md:p-10">
              <span className="font-display text-3xl font-medium text-vk-dourado">{n}</span>
              <h3 className="mt-4 text-2xl font-medium text-vk-azul">{t}</h3>
              <p className="mt-2 text-[15px] leading-7 text-vk-tinta/75">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  return (
    <section id="faq" className="border-t border-vk-linha bg-vk-areia px-6 py-18 md:px-10 md:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <Eyebrow center className="text-vk-azul">
            Perguntas frequentes
          </Eyebrow>
          <h2 className="mt-3 text-4xl font-medium text-vk-azul md:text-5xl">Tudo que você precisa saber.</h2>
        </Reveal>
        <div className="mt-12 divide-y divide-vk-linha overflow-hidden rounded-3xl border border-vk-linha bg-white">
          {FAQS.map((f, idx) => (
            <Reveal as="details" key={f.q} delay={((idx % 5) + 1) as 1 | 2 | 3 | 4 | 5} className="group p-6 md:p-8">
              <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-4 font-display text-lg font-medium text-vk-azul md:text-xl [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">{f.q}</span>
                <Plus className="h-5 w-5 shrink-0 text-vk-dourado transition group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-4 text-[16px] leading-relaxed text-vk-tinta/75">{f.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA FINAL (azul sobre amarelo) ---------- */
function CtaFinal() {
  return (
    <section className="relative overflow-hidden bg-vk-amarelo px-6 py-16 text-vk-azul md:px-10 md:py-20">
      <img
        src={asset("/brand/v-creme.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-10 w-72 opacity-[0.25] md:w-[26rem]"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Eyebrow rule="bg-vk-azul" className="text-vk-azul/80">
            Atendimento
          </Eyebrow>
          <h2 className="mt-3 text-3xl font-medium md:text-4xl">Ainda com dúvidas? Fale com a gente.</h2>
          <p className="mt-3 max-w-lg text-base text-vk-azul/80">
            Dúvidas sobre pedido, entrega, troca ou produto: abra um chamado e nosso time responde pelo canal que
            você escolher.
          </p>
        </div>
        <Link to="/sac" className={`w-full md:w-auto ${BTN.primary}`}>
          Abrir chamado no SAC
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
