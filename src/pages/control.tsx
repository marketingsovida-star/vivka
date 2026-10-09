import { ProdutoPage } from "@/components/produto-page";
import { PRODUTOS } from "@/data/produtos";

export function ControlPage() {
  return <ProdutoPage produto={PRODUTOS.control} />;
}
