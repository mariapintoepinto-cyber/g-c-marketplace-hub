import { FAIXAS_PRECO, type Anuncio } from "@/data/listings";

export interface Filtros {
  q?: string;
  local?: string;
  faixa?: number;
  marca?: string;
  precoMin?: number;
  precoMax?: number;
  ano?: number;
  kmMax?: number;
  combustivel?: string;
  transmissao?: string;
  tipo?: string;
  finalidade?: string;
  quartos?: number;
  casasBanho?: number;
  areaMin?: number;
  ordenar?: string;
}

export function filtrar(anuncios: Anuncio[], f: Filtros) {
  const q = (f.q ?? "").trim().toLowerCase();
  const faixa = FAIXAS_PRECO[f.faixa ?? 0] ?? FAIXAS_PRECO[0]!;

  let lista = anuncios.filter((a) => {
    if (a.estado !== "activo") return false;
    if (q) {
      const alvo = [
        a.titulo,
        a.descricao,
        a.bairro,
        a.provincia,
        a.veiculo?.marca,
        a.veiculo?.modelo,
        a.imovel?.tipo,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!alvo.includes(q)) return false;
    }
    if (f.local && f.local !== "Todas") {
      if (!`${a.bairro} ${a.provincia}`.toLowerCase().includes(f.local.toLowerCase())) return false;
    }
    if (a.preco < faixa.min || a.preco > faixa.max) return false;
    if (f.precoMin && a.preco < f.precoMin) return false;
    if (f.precoMax && a.preco > f.precoMax) return false;

    if (a.veiculo) {
      if (f.marca && f.marca !== "Todas" && a.veiculo.marca !== f.marca) return false;
      if (f.ano && a.veiculo.ano < f.ano) return false;
      if (f.kmMax && a.veiculo.quilometragem > f.kmMax) return false;
      if (f.combustivel && f.combustivel !== "Todos" && a.veiculo.combustivel !== f.combustivel) return false;
      if (f.transmissao && f.transmissao !== "Todas" && a.veiculo.transmissao !== f.transmissao) return false;
    }
    if (a.imovel) {
      if (f.tipo && f.tipo !== "Todos" && a.imovel.tipo !== f.tipo) return false;
      if (f.finalidade && f.finalidade !== "Todas" && a.imovel.finalidade !== f.finalidade) return false;
      if (f.quartos && a.imovel.quartos < f.quartos) return false;
      if (f.casasBanho && a.imovel.casasBanho < f.casasBanho) return false;
      if (f.areaMin && a.imovel.area < f.areaMin) return false;
    }
    return true;
  });

  switch (f.ordenar) {
    case "menor-preco":
      lista = [...lista].sort((a, b) => a.preco - b.preco);
      break;
    case "maior-preco":
      lista = [...lista].sort((a, b) => b.preco - a.preco);
      break;
    case "mais-vistos":
      lista = [...lista].sort((a, b) => b.visualizacoes - a.visualizacoes);
      break;
    default:
      lista = [...lista].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  }
  return lista;
}
