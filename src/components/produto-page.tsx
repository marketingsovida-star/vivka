import { Candy, Check, Clock, MoonStar } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Eyebrow, Footer, PriceCards, ProductTopBar, THEME, TrustStrip } from "@/components/vivka-ui";
import { type Produto, BASE_URL } from "@/data/produtos";
import { useHead } from "@/lib/head";

export function ProdutoPage({ produto }: { produto: Produto }) {
  const t = THEME[produto.id];
  const MomentoIcon = produto.id === "control" ? Candy : MoonStar;
  const precoMin = produto.precos[0].total.replace(".", "").replace(",", ".");

  useHead({
    title: `Vivka ${produto.nome} — ${produto.tagline.replace(/\.$/, "")} | Vivka`,
    description: produto.descricao,
    path: produto.slug,
    ogType: "product",
    ogImage: produto.image,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Vivka ${produto.nome}`,
      description: produto.descricao,
      image: `${BASE_URL}${produto.image}`,
      brand: { "@type": "Brand", name: "Vivka" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BRL",
        lowPrice: precoMin,
        offerCount: produto.precos.length,
        availability: "https://schema.org/InStock",
        url: `${BASE_URL}${produto.slug}`,
      },
    },
  });

  return (
    <div className="min-h-screen bg-vk-creme text-vk-tinta">
      <ProductTopBar />
      <main>
        {/* VENDA — título/descritivo centralizado (padrão das páginas da Galli) */}
        <section id="precos" className="px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <Reveal immediate className="mx-auto max-w-2xl text-center">
              <Eyebrow center rule={t.dot} className="text-vk-azul">
                <span className="flex items-center gap-2">
                  <MomentoIcon className="h-4 w-4" aria-hidden="true" /> {produto.momentoLabel}
                </span>
              </Eyebrow>
              <h1 className="mt-4 text-4xl font-medium text-vk-azul md:text-5xl">
                Vivka <span className={t.mark}>{produto.nome}</span>
              </h1>
              <p className="mt-4 font-display text-xl text-vk-tinta/80 md:text-2xl">{produto.tagline}</p>
              <p className="label-caps mt-4 text-vk-tinta/55">
                {produto.apresentacao} · {produto.doses} · {produto.sabor}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {produto.beneficios.map((b) => (
                  <span
                    key={b}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${t.chip}`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" /> {b}
                  </span>
                ))}
              </div>
            </Reveal>
            <div className="mt-10">
              <PriceCards precos={produto.precos} produtoNome={`Vivka ${produto.nome}`} imagePrefix={produto.id} accent={produto.id} />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-vk-tinta/55">
              Valores de referência. A compra é finalizada com nossa equipe pelo WhatsApp.
            </p>
            <div className="mt-12">
              <TrustStrip />
            </div>
          </div>
        </section>

        {/* MODO DE USO + COMPOSIÇÃO */}
        <section className="border-t border-vk-linha bg-vk-areia px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal>
              <Eyebrow rule={t.dot} className="text-vk-azul">
                Modo de uso
              </Eyebrow>
              <h2 className="mt-3 text-3xl font-medium text-vk-azul md:text-4xl">Simples na sua rotina.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-vk-tinta/80">{produto.modoUso}</p>
              <p className="mt-6 max-w-md text-xs leading-6 text-vk-tinta/55">
                Composição e modo de uso conforme o rótulo. Este produto é um suplemento alimentar e não substitui uma
                alimentação equilibrada nem acompanhamento profissional. Gestantes, lactantes e pessoas em uso de
                medicamentos devem consultar um profissional de saúde antes de usar.
              </p>
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-vk-linha bg-vk-creme p-5">
                <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${t.check}`}>
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="label-caps text-vk-tinta/55">Quando usar</p>
                  <p className="mt-1 font-display text-xl text-vk-azul">{produto.quando}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <Eyebrow rule={t.dot} className="text-vk-azul">
                Composição
              </Eyebrow>
              <h2 className="mt-3 text-3xl font-medium text-vk-azul md:text-4xl">O que há em cada dose.</h2>
              <div className="mt-7 overflow-hidden rounded-2xl border border-vk-linha bg-white">
                <div className={`label-caps grid grid-cols-[1fr_auto] px-5 py-3 text-[11px] ${t.tableHead}`}>
                  <span>Ativo</span>
                  <span>Por dose</span>
                </div>
                {produto.composicao.map((item, i) => (
                  <div
                    key={item.nome}
                    className={`grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 text-[15px] text-vk-tinta ${
                      i > 0 ? "border-t border-vk-linha" : ""
                    }`}
                  >
                    <span>{item.nome}</span>
                    <span className="text-vk-tinta/70">{item.qtd}</span>
                  </div>
                ))}
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {produto.ativosDestaque.map((a) => (
                  <li key={a.nome} className="rounded-2xl border border-vk-linha bg-vk-creme p-4">
                    <p className="text-sm font-semibold text-vk-azul">{a.nome}</p>
                    <p className="mt-1 text-sm leading-6 text-vk-tinta/70">{a.beneficio}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
