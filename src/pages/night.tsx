import { ProdutoPage } from "@/components/produto-page";
import { PRODUTOS } from "@/data/produtos";

export function NightPage() {
  return <ProdutoPage produto={PRODUTOS.night} />;
}
