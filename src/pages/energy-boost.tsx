import { ProdutoPage } from "@/components/produto-page";
import { PRODUTOS } from "@/data/produtos";

export function EnergyBoostPage() {
  return <ProdutoPage produto={PRODUTOS["energy-boost"]} detalharAtivos />;
}
