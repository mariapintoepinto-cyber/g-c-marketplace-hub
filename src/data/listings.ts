import carPrado from "@/assets/car-prado.jpg";
import carHilux from "@/assets/car-hilux.jpg";
import carTucson from "@/assets/car-tucson.jpg";
import carBmw from "@/assets/car-bmw.jpg";
import casaT3 from "@/assets/house-moradia-t3.jpg";
import aptT2 from "@/assets/house-apartamento-t2.jpg";
import casaT4 from "@/assets/house-moradia-t4.jpg";
import aptT3 from "@/assets/house-apartamento-t3.jpg";

export type Categoria = "carro" | "imovel";
export type Estado = "activo" | "vendido" | "pausado";

export interface Veiculo {
  marca: string;
  modelo: string;
  ano: number;
  quilometragem: number;
  combustivel: "Gasolina" | "Diesel" | "Híbrido" | "Elétrico";
  transmissao: "Manual" | "Automática";
  tracao: string;
  cor: string;
}

export interface Imovel {
  tipo: "Moradia" | "Apartamento" | "Terreno" | "Escritório" | "Loja" | "Armazém";
  quartos: number;
  casasBanho: number;
  area: number;
  finalidade: "Venda" | "Arrendamento";
  estacionamento: number;
}

export interface Anuncio {
  id: string;
  userId: string;
  categoria: Categoria;
  titulo: string;
  descricao: string;
  preco: number;
  bairro: string;
  provincia: string;
  estado: Estado;
  visualizacoes: number;
  criadoEm: string;
  imagens: string[];
  vendedor: { nome: string; telefone: string; tipo: string };
  veiculo?: Veiculo;
  imovel?: Imovel;
  caracteristicas?: string[];
}

export const PROVINCIAS = [
  "Luanda",
  "Viana",
  "Talatona",
  "Kilamba",
  "Benfica",
  "Maianga",
  "Cacuaco",
  "Belas",
  "Benguela",
  "Huíla",
  "Cabinda",
  "Huambo",
  "Outras províncias",
];

export const FAIXAS_PRECO = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "Até 5.000.000 Kz", min: 0, max: 5_000_000 },
  { label: "5.000.000 – 15.000.000 Kz", min: 5_000_000, max: 15_000_000 },
  { label: "15.000.000 – 30.000.000 Kz", min: 15_000_000, max: 30_000_000 },
  { label: "30.000.000 – 50.000.000 Kz", min: 30_000_000, max: 50_000_000 },
  { label: "Acima de 50.000.000 Kz", min: 50_000_000, max: Infinity },
];

export const MARCAS = [
  "Toyota",
  "Hyundai",
  "BMW",
  "Mercedes-Benz",
  "Nissan",
  "Kia",
  "Mitsubishi",
  "Ford",
];

const vendedorPadrao = { nome: "G&C Solutions", telefone: "+244 925 649 926", tipo: "Vendedor verificado" };

export const ANUNCIOS: Anuncio[] = [
  {
    id: "c1",
    userId: "u1",
    categoria: "carro",
    titulo: "Toyota Land Cruiser Prado",
    descricao:
      "Viatura em excelente estado, manutenção sempre feita em oficina da marca. Interior em pele, sistema multimédia, câmara de marcha-atrás e pneus novos. Documentação toda em ordem e pronta para transferência.",
    preco: 54_000_000,
    bairro: "Talatona",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 1240,
    criadoEm: "2026-08-20",
    imagens: [carPrado, carHilux, carTucson],
    vendedor: vendedorPadrao,
    veiculo: {
      marca: "Toyota",
      modelo: "Land Cruiser Prado",
      ano: 2021,
      quilometragem: 45_000,
      combustivel: "Diesel",
      transmissao: "Automática",
      tracao: "4x4",
      cor: "Preto",
    },
    caracteristicas: ["Ar condicionado", "Vidros eléctricos", "Sensores de estacionamento", "Jantes de liga leve"],
  },
  {
    id: "c2",
    userId: "u1",
    categoria: "carro",
    titulo: "Toyota Hilux",
    descricao:
      "Pick-up robusta, ideal para trabalho e estrada difícil. Motor diesel fiável, caixa manual e capacidade de carga elevada. Revisão feita recentemente.",
    preco: 32_500_000,
    bairro: "Viana",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 890,
    criadoEm: "2026-08-14",
    imagens: [carHilux, carPrado],
    vendedor: vendedorPadrao,
    veiculo: {
      marca: "Toyota",
      modelo: "Hilux",
      ano: 2019,
      quilometragem: 120_000,
      combustivel: "Diesel",
      transmissao: "Manual",
      tracao: "4x4",
      cor: "Prata",
    },
    caracteristicas: ["Ar condicionado", "Direcção assistida", "Barra de protecção"],
  },
  {
    id: "c3",
    userId: "u2",
    categoria: "carro",
    titulo: "Hyundai Tucson",
    descricao:
      "SUV citadino praticamente novo, muito económico e confortável. Perfeito para o dia-a-dia em Luanda.",
    preco: 28_000_000,
    bairro: "Maianga",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 654,
    criadoEm: "2026-08-06",
    imagens: [carTucson, carBmw],
    vendedor: vendedorPadrao,
    veiculo: {
      marca: "Hyundai",
      modelo: "Tucson",
      ano: 2022,
      quilometragem: 25_000,
      combustivel: "Gasolina",
      transmissao: "Automática",
      tracao: "4x2",
      cor: "Branco",
    },
    caracteristicas: ["Ecrã táctil", "Câmara traseira", "Bluetooth"],
  },
  {
    id: "c4",
    userId: "u2",
    categoria: "carro",
    titulo: "BMW 320i",
    descricao:
      "Berlina desportiva, bem conservada e com histórico de manutenção. Condução suave e acabamentos premium.",
    preco: 24_500_000,
    bairro: "Kilamba",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 512,
    criadoEm: "2026-07-29",
    imagens: [carBmw, carTucson],
    vendedor: vendedorPadrao,
    veiculo: {
      marca: "BMW",
      modelo: "320i",
      ano: 2018,
      quilometragem: 80_000,
      combustivel: "Gasolina",
      transmissao: "Automática",
      tracao: "4x2",
      cor: "Azul",
    },
    caracteristicas: ["Estofos em pele", "Sensores de chuva", "Cruise control"],
  },
  {
    id: "i1",
    userId: "u1",
    categoria: "imovel",
    titulo: "Moradia T3",
    descricao:
      "Moradia espaçosa em zona tranquila, com quintal, garagem fechada e cozinha equipada. Excelente para família.",
    preco: 45_000_000,
    bairro: "Bairro da Maianga",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 980,
    criadoEm: "2026-08-22",
    imagens: [casaT3, casaT4],
    vendedor: vendedorPadrao,
    imovel: { tipo: "Moradia", quartos: 3, casasBanho: 3, area: 200, finalidade: "Venda", estacionamento: 2 },
    caracteristicas: ["Quintal", "Garagem fechada", "Cozinha equipada", "Água e luz da rede"],
  },
  {
    id: "i2",
    userId: "u2",
    categoria: "imovel",
    titulo: "Apartamento T2",
    descricao:
      "Apartamento moderno em condomínio com piscina e segurança 24 horas. Totalmente mobilado, pronto a habitar.",
    preco: 1_200_000,
    bairro: "Talatona",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 743,
    criadoEm: "2026-08-18",
    imagens: [aptT2, aptT3],
    vendedor: vendedorPadrao,
    imovel: { tipo: "Apartamento", quartos: 2, casasBanho: 2, area: 120, finalidade: "Arrendamento", estacionamento: 1 },
    caracteristicas: ["Piscina", "Segurança 24h", "Mobilado", "Gerador"],
  },
  {
    id: "i3",
    userId: "u1",
    categoria: "imovel",
    titulo: "Moradia T4",
    descricao:
      "Moradia de luxo com amplo jardim, área de lazer e acabamentos de qualidade superior. Condomínio fechado.",
    preco: 70_000_000,
    bairro: "Kilamba",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 1120,
    criadoEm: "2026-08-10",
    imagens: [casaT4, casaT3],
    vendedor: vendedorPadrao,
    imovel: { tipo: "Moradia", quartos: 4, casasBanho: 4, area: 300, finalidade: "Venda", estacionamento: 3 },
    caracteristicas: ["Jardim", "Área de lazer", "Condomínio fechado", "Painéis solares"],
  },
  {
    id: "i4",
    userId: "u2",
    categoria: "imovel",
    titulo: "Apartamento T3",
    descricao:
      "Apartamento amplo com boas vistas, elevador e lugar de estacionamento. Perto de escolas e comércio.",
    preco: 1_500_000,
    bairro: "Ingombota",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 601,
    criadoEm: "2026-08-02",
    imagens: [aptT3, aptT2],
    vendedor: vendedorPadrao,
    imovel: { tipo: "Apartamento", quartos: 3, casasBanho: 2, area: 150, finalidade: "Arrendamento", estacionamento: 1 },
    caracteristicas: ["Elevador", "Varanda", "Estacionamento"],
  },
  {
    id: "c5",
    userId: "u1",
    categoria: "carro",
    titulo: "Mitsubishi Pajero",
    descricao: "Todo-o-terreno fiável, muito bem cuidado, ideal para viagens pelas províncias.",
    preco: 19_500_000,
    bairro: "Cacuaco",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 322,
    criadoEm: "2026-07-20",
    imagens: [carPrado],
    vendedor: vendedorPadrao,
    veiculo: {
      marca: "Mitsubishi",
      modelo: "Pajero",
      ano: 2015,
      quilometragem: 165_000,
      combustivel: "Diesel",
      transmissao: "Manual",
      tracao: "4x4",
      cor: "Cinza",
    },
  },
  {
    id: "c6",
    userId: "u2",
    categoria: "carro",
    titulo: "Kia Sportage",
    descricao: "SUV económico, primeiro dono, com livro de revisões completo.",
    preco: 15_900_000,
    bairro: "Benfica",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 277,
    criadoEm: "2026-07-11",
    imagens: [carTucson],
    vendedor: vendedorPadrao,
    veiculo: {
      marca: "Kia",
      modelo: "Sportage",
      ano: 2017,
      quilometragem: 98_000,
      combustivel: "Gasolina",
      transmissao: "Automática",
      tracao: "4x2",
      cor: "Vermelho",
    },
  },
  {
    id: "i5",
    userId: "u1",
    categoria: "imovel",
    titulo: "Terreno 500 m²",
    descricao: "Terreno murado com documentação em ordem, pronto para construção.",
    preco: 12_000_000,
    bairro: "Belas",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 188,
    criadoEm: "2026-06-30",
    imagens: [casaT3],
    vendedor: vendedorPadrao,
    imovel: { tipo: "Terreno", quartos: 0, casasBanho: 0, area: 500, finalidade: "Venda", estacionamento: 0 },
  },
  {
    id: "i6",
    userId: "u2",
    categoria: "imovel",
    titulo: "Escritório 90 m²",
    descricao: "Escritório em edifício empresarial, com ar condicionado central e recepção.",
    preco: 900_000,
    bairro: "Ingombota",
    provincia: "Luanda",
    estado: "activo",
    visualizacoes: 143,
    criadoEm: "2026-06-22",
    imagens: [aptT3],
    vendedor: vendedorPadrao,
    imovel: { tipo: "Escritório", quartos: 0, casasBanho: 2, area: 90, finalidade: "Arrendamento", estacionamento: 2 },
  },
];
