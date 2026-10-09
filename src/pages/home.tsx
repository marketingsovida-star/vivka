import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Candy,
  Check,
  Citrus,
  CupSoda,
  ListChecks,
  MoonStar,
  Package,
  Plus,
  ShieldCheck,
  SunMoon,
  Truck,
} from "lucide-react";
import { Reveal, RevealImage } from "@/components/reveal";
import { BTN, Eyebrow, Footer, Logo, NAV, PriceCards, THEME } from "@/components/vivka-ui";
import { PRODUTOS, KIT_PRECOS, asset, type Produto } from "@/data/produtos";
import { useHead } from "@/lib/head";

const FAQS = [
  {
    q: "Qual a diferença entre o Control e o Night?",
    a: "Cada um foi pensado para um momento do dia. O Control é para a tarde: cromo picolinato, L-triptofano, Gymnema e Safron numa base de cacau, para tomar logo após o almoço, quando a vontade de doce costuma aparecer. O Night é para a noite: inositol, magnésio bisglicinato, L-teanina e melatonina, sabor laranja, para tomar 30 minutos antes de deitar.",
  },
  {
    q: "Posso usar os dois no mesmo dia?",
    a: "Sim. Eles foram pensados como um par: o Control acompanha a sua tarde e o Night, a sua noite. Em caso de dúvida, converse com o seu profissional de saúde.",
  },
  {
    q: "Como devo usar?",
    a: "Control: 5 g (1 dose) diluídos em 200 ml de água, logo após o almoço. Night: 3 g (1 dose) diluídos em 200 ml de água, à noite, 30 minutos antes de deitar.",
  },
  {
    q: "Quantas doses tem cada frasco?",
    a: "Os dois vêm em frascos de 150 g. O Control rende 30 doses de 5 g, e o Night rende 50 doses de 3 g.",
  },
  {
    q: "Qual é o sabor?",
    a: "O Control tem base de cacau. O Night tem sabor laranja. Os dois são em pó, para diluir em água.",
  },
  {
    q: "Como funciona a garantia?",
    a: "Você tem 7 dias para testar. Se não ficar satisfeito, abra um chamado no nosso SAC e orientamos a devolução.",
  },
  {
    q: "Como funciona a compra?",
    a: "Por enquanto, a compra é feita diretamente com a nossa equipe pelo WhatsApp. É só escolher a opção desejada e clicar em Adquirir.",
  },
  {
    q: "Os produtos substituem acompanhamento médico?",
    a: "Não. Control e Night são suplementos alimentares, não medicamentos. Eles não substituem uma alimentação equilibrada nem o acompanhamento de um profissional de saúde. Gestantes, lactantes e pessoas em uso de medicamentos devem consultar um profissional antes de usar.",
  },
];

const DESCRIPTION =
  "Vivka Control e Night: suplementos em pó para dois momentos do dia. Control para a vontade de doces à tarde, Night para noites melhores. Liberdade para o seu dia. Descanso para a sua noite.";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function HomePage() {
  useHead({
    title: "Vivka — Control & Night | Liberdade para o seu dia. Descanso para a sua noite.",
    description: DESCRIPTION,
    path: "/",
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
      <StickyHeader visible={stuck} />
      <main>
        <div ref={heroRef}>
          <Hero />
        </div>
        <BenefitStrip />
        <Produtos />
        <ProdutoNight />
        <DiaENoite />
        <Momentos />
        <Diferenciais />
        <Manifesto />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- STICKY HEADER ---------- */
function StickyHeader({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 border-b border-vk-linha bg-vk-creme/92 backdrop-blur transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        <a href="#inicio" aria-label="Voltar ao início">
          <Logo variant="azul" className="h-5" />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href.replace("/", "")} className="text-sm text-vk-tinta/75 transition-colors hover:text-vk-azul">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#produtos" className={`${BTN.primary} min-h-10 px-5`}>
          Ver produtos
        </a>
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-vk-creme">
      {/* Foto-banner (potes à direita); no mobile a foto aparece abaixo do texto */}
      <div
        className="absolute inset-0 hidden bg-cover bg-no-repeat lg:block lg:bg-[position:right_center]"
        style={{ backgroundImage: `url('${asset("/photos/hero-banner.webp")}')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{ background: "linear-gradient(90deg, rgba(255,249,238,0.97) 0%, rgba(255,249,238,0.9) 30%, rgba(255,249,238,0.45) 48%, rgba(255,249,238,0) 62%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-6 md:px-10 md:pb-24 md:pt-7">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-6 border-b border-vk-azul/15 pb-5">
          <Logo variant="azul" className="h-6 md:h-7" />
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href.replace("/", "")} className="text-sm text-vk-azul/80 transition-colors hover:text-vk-azul">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#produtos" className={`${BTN.primary} hidden min-h-10 px-5 md:inline-flex`}>
            Ver produtos
          </a>
        </div>

        <div className="flex items-center py-8 md:py-12 lg:min-h-[620px]">
          <Reveal immediate className="w-full max-w-xl">
            <Eyebrow className="text-vk-azul">Vivka · Um para cada momento</Eyebrow>
            <h1 className="mt-6 text-5xl font-medium leading-[1.08] text-vk-azul md:text-6xl lg:text-[4.6rem]">
              Liberdade para o seu <span className="mark-dia">dia.</span> Descanso para a sua{" "}
              <span className="mark-noite">noite.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-vk-tinta/80 md:text-lg md:leading-8">
              Control para a tarde, quando o doce chama. Night para a noite, quando é hora de descansar. Dois
              suplementos em pó, com cada ativo apresentado pelo que é.
            </p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a href="#produtos" className={`group w-full sm:w-auto ${BTN.primary}`}>
                Conhecer os produtos
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a href="#dia-e-noite" className={`w-full sm:w-auto ${BTN.outline}`}>
                Ver o kit Dia + Noite
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-vk-azul/70">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Garantia de 7 dias
              </span>
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" aria-hidden="true" /> Entrega para todo o Brasil
              </span>
            </div>
          </Reveal>
        </div>

        <div className="overflow-hidden rounded-3xl border border-vk-linha shadow-[var(--shadow-card)] lg:hidden">
          <img
            src={asset("/photos/hero-banner.webp")}
            alt="Potes Vivka Night e Control sobre mármore, com arcos azul, dourado e amarelo ao fundo"
            className="w-full object-cover"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- BENEFIT STRIP ---------- */
function BenefitStrip() {
  const items = [
    { icon: CupSoda, label: "Em pó, diluído na água" },
    { icon: ListChecks, label: "Fórmula declarada" },
    { icon: Package, label: "150 g por frasco" },
    { icon: SunMoon, label: "Um para cada momento" },
    { icon: Citrus, label: "Cacau e laranja" },
    { icon: ShieldCheck, label: "7 dias de garantia" },
  ];
  return (
    <section aria-label="Características dos produtos Vivka" className="border-y border-vk-linha bg-vk-areia">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-6 py-10 md:grid-cols-6 md:gap-y-0 md:px-10">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-3 text-center">
            <Icon className="h-8 w-8 text-vk-azul" strokeWidth={1.3} aria-hidden="true" />
            <span className="text-sm font-medium text-vk-azul">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- PRODUTOS (Control, seção clara) ---------- */
function Produtos() {
  return (
    <section id="produtos" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 border-b border-vk-linha pb-7 md:grid-cols-[1fr_2fr] md:items-end">
          <Eyebrow className="text-vk-azul">Os produtos</Eyebrow>
          <h2 className="max-w-3xl text-4xl font-medium leading-tight text-vk-azul md:text-5xl">
            Cor para cada momento. <span className="text-vk-azul/55">Uma assinatura para toda a linha.</span>
          </h2>
        </Reveal>
        <div className="mt-14">
          <ProdutoRow produto={PRODUTOS.control} dark={false} />
        </div>
      </div>
    </section>
  );
}

/* ---------- PRODUTO NIGHT (seção escura: dourado sobre azul) ---------- */
function ProdutoNight() {
  return (
    <section className="relative overflow-hidden bg-vk-azul px-6 py-20 md:px-10 md:py-28">
      <img
        src={asset("/brand/v-dourado.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-6 w-[22rem] opacity-[0.06] md:w-[30rem]"
      />
      <div className="relative mx-auto max-w-7xl">
        <ProdutoRow produto={PRODUTOS.night} dark />
      </div>
    </section>
  );
}

function ProdutoRow({ produto, dark }: { produto: Produto; dark: boolean }) {
  const t = THEME[produto.id];
  const MomentoIcon = produto.id === "control" ? Candy : MoonStar;
  const c = dark
    ? {
        eyebrow: "text-vk-dourado",
        rule: "bg-vk-dourado",
        title: "text-vk-creme",
        accent: "text-vk-dourado",
        body: "text-vk-creme/75",
        chip: "border border-vk-dourado/50 bg-vk-dourado/12 text-vk-creme",
        bulletBox: "bg-vk-dourado text-vk-azul",
        line: "border-vk-creme/15",
        meta: "text-vk-creme/70",
        divider: "bg-vk-creme/25",
        imgBorder: "border-vk-dourado/40",
        btn: BTN.gold,
      }
    : {
        eyebrow: "text-vk-azul",
        rule: t.dot,
        title: "text-vk-azul",
        accent: t.mark,
        body: "text-vk-tinta/80",
        chip: t.chip,
        bulletBox: t.check,
        line: "border-vk-linha",
        meta: "text-vk-tinta/70",
        divider: "bg-vk-linha",
        imgBorder: "border-vk-linha",
        btn: BTN.yellow,
      };
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <Link to={produto.slug} className={`block overflow-hidden rounded-3xl border ${c.imgBorder} shadow-[var(--shadow-card)]`}>
          <RevealImage
            src={asset(produto.image)}
            alt={produto.imageAlt}
            loading="lazy"
            wrapperClassName="w-full"
            className="aspect-[5/4] w-full object-cover"
          />
        </Link>
      </Reveal>

      <Reveal delay={2}>
        <Eyebrow rule={c.rule} className={c.eyebrow}>
          <span className="flex items-center gap-2">
            <MomentoIcon className="h-4 w-4" aria-hidden="true" /> {produto.momentoLabel}
          </span>
        </Eyebrow>
        <h3 className={`mt-4 text-4xl font-medium md:text-5xl ${c.title}`}>
          Vivka <span className={c.accent}>{produto.nome}</span>
        </h3>
        <p className={`mt-3 font-display text-xl ${c.body}`}>{produto.tagline}</p>
        <p className={`mt-4 max-w-xl text-base leading-7 md:text-lg ${c.body}`}>{produto.descricao}</p>

        <ul className="mt-7 space-y-3">
          {produto.beneficios.map((b) => (
            <li key={b} className={`flex items-center gap-3 text-base ${c.title}`}>
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${c.bulletBox}`}>
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-2">
          {produto.ativosDestaque.map((a) => (
            <span key={a.nome} className={`rounded-full px-3 py-1 text-xs font-medium ${c.chip}`}>
              {a.nome}
            </span>
          ))}
        </div>

        <div className={`mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-5 text-sm ${c.line} ${c.meta}`}>
          <span>
            {produto.apresentacao} · {produto.doses}
          </span>
          <span className={`h-3 w-px ${c.divider}`} aria-hidden="true" />
          <span>{produto.quando}</span>
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link to={produto.slug} className={`w-full sm:w-auto ${c.btn}`}>
            Adquirir
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <span className={`text-sm ${c.meta}`}>
            A partir de <strong className={c.title}>R$ {produto.precos[0].total}</strong>
          </span>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------- DIA + NOITE (kit Control + Night) ---------- */
function DiaENoite() {
  return (
    <section id="dia-e-noite" className="scroll-mt-20 border-b border-vk-linha bg-vk-areia px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-vk-linha shadow-[var(--shadow-card)]">
              <RevealImage
                src={asset("/photos/momentos.webp")}
                alt="Potes Vivka Night e Control sobre mármore, entre a sombra azul da noite e a luz dourada do dia"
                loading="lazy"
                wrapperClassName="w-full"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={2}>
            <Eyebrow className="text-vk-azul">Kit Dia + Noite · Control + Night</Eyebrow>
            <h2 className="mt-3 text-4xl font-medium text-vk-azul md:text-5xl">Vivka une os dois momentos.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-vk-tinta/80 md:text-lg">
              Quando o doce chama, você escolhe. Quando a noite chega, você descansa. Control e Night foram pensados
              como um par, e juntos têm preços especiais nos kits de 3 e 5.
            </p>
            <ul className="mt-6 space-y-2">
              {["1 Vivka Control (150 g · 30 doses)", "1 Vivka Night (150 g · 50 doses)", "Da tarde à noite, em um só cuidado"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-base text-vk-tinta">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-vk-azul text-vk-dourado">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-14">
          <PriceCards precos={KIT_PRECOS} produtoNome="Kit Vivka Dia + Noite (Control + Night)" imagePrefix="kit" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-vk-tinta/55">
            Valores de referência. A compra é finalizada com nossa equipe pelo WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- MOMENTOS (tarde / noite) ---------- */
function Momentos() {
  const passos = [
    {
      icon: Candy,
      tag: "Tarde · Control",
      titulo: "Quando o doce chama",
      desc: "Logo após o almoço, 5 g em 200 ml de água. Cromo picolinato, L-triptofano, Gymnema e Safron, numa base de cacau, para o momento em que a vontade de doce costuma aparecer.",
      cor: "bg-vk-amarelo text-vk-azul",
    },
    {
      icon: MoonStar,
      tag: "Noite · Night",
      titulo: "Quando a noite chega",
      desc: "Trinta minutos antes de deitar, 3 g em 200 ml de água. Inositol, magnésio bisglicinato, L-teanina e melatonina, sabor laranja, para acompanhar o seu descanso.",
      cor: "bg-vk-dourado text-vk-azul",
    },
  ];
  return (
    <section id="momentos" className="relative overflow-hidden bg-vk-azul px-6 py-20 text-vk-creme md:px-10 md:py-28">
      <img
        src={asset("/brand/v-dourado.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 w-72 opacity-[0.06] md:w-[26rem]"
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow center className="text-vk-dourado">
            Dois momentos
          </Eyebrow>
          <h2 className="mt-3 text-4xl font-medium md:text-5xl">Um para a tarde. Outro para a noite.</h2>
          <p className="mt-5 text-base leading-7 text-vk-creme/75 md:text-lg">
            O mesmo desenho, duas cores: amarelo para o dia, azul para a noite. Cada fórmula chega na hora certa.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {passos.map(({ icon: Icon, tag, titulo, desc, cor }, i) => (
            <Reveal key={tag} delay={(i + 1) as 1 | 2} className="rounded-3xl border border-vk-creme/15 bg-vk-creme/5 p-8 md:p-12">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${cor}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="label-caps mt-6 text-vk-dourado">{tag}</p>
              <h3 className="mt-2 text-2xl font-medium text-vk-creme">{titulo}</h3>
              <p className="mt-3 max-w-md text-base leading-7 text-vk-creme/75">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- DIFERENCIAIS ---------- */
function Diferenciais() {
  const itens = [
    { n: "01", t: "Um para cada momento", d: "Control logo após o almoço, Night antes de deitar. Cada produto cuida de uma hora do dia, sem promessas genéricas." },
    { n: "02", t: "Você sabe o que toma", d: "Ativos e quantidades por dose apresentados de forma clara, no rótulo e no site, para uma escolha consciente." },
    { n: "03", t: "Em pó, na água", d: "Nada de contar cápsulas: uma dose, 200 ml de água e pronto. Base de cacau à tarde, sabor laranja à noite." },
    { n: "04", t: "Garantia de 7 dias", d: "Você testa com tranquilidade. Se não ficar satisfeito, nosso SAC orienta a devolução. Entrega para todo o Brasil." },
  ];
  return (
    <section id="diferenciais" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow center className="text-vk-azul">
            Por que Vivka
          </Eyebrow>
          <h2 className="mt-3 text-4xl font-medium text-vk-azul md:text-5xl">Simples de entender. Simples de usar.</h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-vk-linha bg-vk-linha md:grid-cols-2">
          {itens.map(({ n, t, d }, i) => (
            <Reveal key={n} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="bg-vk-creme p-8 md:p-10">
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

/* ---------- MANIFESTO (creme sobre vinho — expressão institucional) ---------- */
function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-vk-vinho px-6 py-20 text-vk-creme md:px-10 md:py-28">
      <img
        src={asset("/brand/v-creme.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-16 w-80 opacity-[0.07] md:w-[30rem]"
      />
      <Reveal className="relative mx-auto max-w-4xl text-center">
        <Logo variant="creme" className="mx-auto h-6 md:h-8" />
        <p className="mt-10 text-3xl font-medium leading-tight md:text-5xl">
          Quando o doce chama, você escolhe. <br className="hidden md:block" />
          Quando a noite chega, você descansa.
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-vk-creme/80 md:text-lg">
          Vivka une os dois momentos: um pó para a tarde, outro para a noite, com a mesma assinatura e a mesma
          clareza sobre o que há em cada dose.
        </p>
        <div className="mt-9">
          <a href="#produtos" className={BTN.light}>
            Conhecer os produtos
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <Eyebrow center className="text-vk-azul">
            Perguntas frequentes
          </Eyebrow>
          <h2 className="mt-3 text-4xl font-medium text-vk-azul md:text-5xl">Tudo que você precisa saber.</h2>
        </Reveal>
        <div className="mt-12 divide-y divide-vk-linha overflow-hidden rounded-3xl border border-vk-linha bg-white">
          {FAQS.map((f, i) => (
            <Reveal as="details" key={f.q} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5} className="group p-6 md:p-8">
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

/* ---------- CTA FINAL (azul sobre amarelo — presença diurna) ---------- */
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
          <h2 className="mt-3 text-3xl font-medium md:text-4xl">Precisa de ajuda? Fale com a gente.</h2>
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
