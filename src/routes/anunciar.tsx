import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  Eye,
  Home as HomeIcon,
  Image as ImageIcon,
  MapPin,
  PlusCircle,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import carPrado from "@/assets/car-prado.jpg";
import casaT3 from "@/assets/house-moradia-t3.jpg";
import { MARCAS, PROVINCIAS, type Categoria } from "@/data/listings";
import { formatPreco } from "@/lib/format";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anunciar")({
  head: () => ({
    meta: [
      { title: "Publicar Anúncio — G&C Solutions" },
      {
        name: "description",
        content:
          "Publique o seu anúncio de carro ou imóvel na G&C Solutions e alcance milhares de compradores em Angola.",
      },
    ],
  }),
  component: PaginaAnunciar,
});

const ETAPAS = [
  "1. Categoria",
  "2. Informações",
  "3. Preço & Local",
  "4. Fotografias",
  "5. Pré-visualização",
  "6. Publicação",
];

function PaginaAnunciar() {
  const navigate = useNavigate();
  const { criarAnuncio, utilizador } = useLoja();

  const [etapa, setEtapa] = useState(1);
  const [categoria, setCategoria] = useState<Categoria>("carro");

  // Dados comuns
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState<number | "">("");
  const [provincia, setProvincia] = useState("Luanda");
  const [bairro, setBairro] = useState("");
  const [imagens, setImagens] = useState<string[]>([categoria === "carro" ? carPrado : casaT3]);
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);
  const [novaCaracteristica, setNovaCaracteristica] = useState("");

  // Dados do Carro
  const [marca, setMarca] = useState("Toyota");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState(2022);
  const [km, setKm] = useState<number | "">("");
  const [combustivel, setCombustivel] = useState<"Gasolina" | "Diesel" | "Híbrido" | "Elétrico">("Gasolina");
  const [transmissao, setTransmissao] = useState<"Manual" | "Automática">("Automática");
  const [tracao, setTracao] = useState("4x2");
  const [cor, setCor] = useState("Branco");

  // Dados do Imóvel
  const [tipoImovel, setTipoImovel] = useState<"Moradia" | "Apartamento" | "Terreno" | "Escritório" | "Loja" | "Armazém">("Moradia");
  const [finalidade, setFinalidade] = useState<"Venda" | "Arrendamento">("Venda");
  const [quartos, setQuartos] = useState(3);
  const [casasBanho, setCasasBanho] = useState(2);
  const [area, setArea] = useState<number | "">("");
  const [estacionamento, setEstacionamento] = useState(2);

  // Vendedor
  const [nomeVendedor, setNomeVendedor] = useState(utilizador ? `${utilizador.nome} ${utilizador.apelido}`.trim() : "");
  const [telefoneVendedor, setTelefoneVendedor] = useState(utilizador ? utilizador.telefone : "");

  const handleNext = () => {
    if (etapa === 1) {
      if (!imagens.length || imagens[0] === carPrado || imagens[0] === casaT3) {
        setImagens([categoria === "carro" ? carPrado : casaT3]);
      }
      setEtapa(2);
      return;
    }

    if (etapa === 2) {
      if (!titulo.trim()) {
        toast.error("Por favor indique o título do anúncio.");
        return;
      }
      if (categoria === "carro" && !modelo.trim()) {
        toast.error("Por favor indique o modelo do veículo.");
        return;
      }
      setEtapa(3);
      return;
    }

    if (etapa === 3) {
      if (!preco || Number(preco) <= 0) {
        toast.error("Por favor indique um preço válido em Kz.");
        return;
      }
      if (!bairro.trim()) {
        toast.error("Por favor indique o bairro ou zona.");
        return;
      }
      setEtapa(4);
      return;
    }

    if (etapa === 4) {
      if (imagens.length === 0) {
        toast.error("Por favor adicione pelo menos uma fotografia.");
        return;
      }
      setEtapa(5);
      return;
    }

    if (etapa === 5) {
      setEtapa(6);
      return;
    }
  };

  const handlePrev = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagens((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    toast.success("Fotografia(s) adicionada(s) com sucesso.");
  };

  const removerImagem = (index: number) => {
    if (imagens.length === 1) {
      toast.error("O anúncio deve conter pelo menos uma imagem.");
      return;
    }
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const moverImagem = (index: number, direcao: "cima" | "baixo") => {
    setImagens((prev) => {
      const nova = [...prev];
      const targetIndex = direcao === "cima" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= nova.length) return prev;
      const temp = nova[index];
      nova[index] = nova[targetIndex];
      nova[targetIndex] = temp;
      return nova;
    });
  };

  const adicionarCaract = () => {
    if (!novaCaracteristica.trim()) return;
    if (!caracteristicas.includes(novaCaracteristica.trim())) {
      setCaracteristicas([...caracteristicas, novaCaracteristica.trim()]);
      setNovaCaracteristica("");
    }
  };

  const removerCaract = (item: string) => {
    setCaracteristicas(caracteristicas.filter((c) => c !== item));
  };

  const publicarAnuncio = () => {
    const dados = {
      categoria,
      titulo: titulo.trim(),
      descricao: descricao.trim() || `${titulo.trim()} em excelente estado e documentação em dia.`,
      preco: Number(preco),
      bairro: bairro.trim(),
      provincia,
      imagens,
      caracteristicas,
      vendedor: {
        nome: nomeVendedor.trim() || (utilizador ? utilizador.nome : "Vendedor G&C"),
        telefone: telefoneVendedor.trim() || (utilizador ? utilizador.telefone : "+244 925 649 926"),
        tipo: "Particular",
      },
      ...(categoria === "carro"
        ? {
            veiculo: {
              marca,
              modelo: modelo.trim() || titulo,
              ano: Number(ano),
              quilometragem: Number(km) || 0,
              combustivel,
              transmissao,
              tracao,
              cor,
            },
          }
        : {
            imovel: {
              tipo: tipoImovel,
              quartos: Number(quartos),
              casasBanho: Number(casasBanho),
              area: Number(area) || 120,
              finalidade,
              estacionamento: Number(estacionamento),
            },
          }),
    };

    const id = criarAnuncio(dados);
    toast.success("Parabéns! O seu anúncio foi publicado com sucesso na G&C Solutions.");
    navigate({ to: "/painel" });
  };

  return (
    <div className="min-h-[80vh] bg-surface pb-16">
      {/* Top Banner */}
      <section className="bg-navy py-10 sm:py-14">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">Publicação Simplificada</span>
          <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Publicar Novo Anúncio</h1>
          <p className="mt-1 text-xs text-white/75 sm:text-sm">
            Alcance milhares de compradores em Luanda e em todas as províncias de Angola.
          </p>

          {/* Stepper */}
          <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ETAPAS.map((nome, i) => {
              const num = i + 1;
              const activo = etapa === num;
              const concluido = etapa > num;
              return (
                <div
                  key={nome}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-all",
                    activo
                      ? "bg-gold text-navy-dark font-extrabold"
                      : concluido
                        ? "bg-white/10 text-white/90"
                        : "bg-white/5 text-white/40",
                  )}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-black/10">
                    {concluido ? <Check className="h-3.5 w-3.5" /> : num}
                  </span>
                  <span className="text-[11px] leading-tight truncate w-full">{nome.replace(/^\d+\.\s*/, "")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Card Principal */}
      <div className="mx-auto mt-8 max-w-[1000px] px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
          {/* ETAPA 1: CATEGORIA */}
          {etapa === 1 && (
            <div>
              <h2 className="text-xl font-extrabold text-navy">Passo 1: Escolha a Categoria do Anúncio</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Selecione o tipo de bem que pretende anunciar para venda ou arrendamento.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setCategoria("carro");
                    setImagens([carPrado]);
                  }}
                  className={cn(
                    "group relative flex flex-col items-center rounded-2xl border-2 p-8 text-center transition-all",
                    categoria === "carro"
                      ? "border-gold bg-gold/5 shadow-md"
                      : "border-border bg-card hover:border-border/80 hover:bg-surface",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-20 w-20 items-center justify-center rounded-2xl transition-colors",
                      categoria === "carro" ? "bg-gold text-navy-dark" : "bg-navy/5 text-navy",
                    )}
                  >
                    <Car className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-navy">Carro / Veículo</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Carros ligeiros, SUVs, carrinhas, 4x4, viaturas comerciais e pesados.
                  </p>
                  {categoria === "carro" && (
                    <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy-dark">
                      <Check className="h-3 w-3" /> Selecionado
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategoria("imovel");
                    setImagens([casaT3]);
                  }}
                  className={cn(
                    "group relative flex flex-col items-center rounded-2xl border-2 p-8 text-center transition-all",
                    categoria === "imovel"
                      ? "border-gold bg-gold/5 shadow-md"
                      : "border-border bg-card hover:border-border/80 hover:bg-surface",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-20 w-20 items-center justify-center rounded-2xl transition-colors",
                      categoria === "imovel" ? "bg-gold text-navy-dark" : "bg-navy/5 text-navy",
                    )}
                  >
                    <HomeIcon className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-navy">Casa / Imóvel</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Moradias, apartamentos, vivendas, terrenos, escritórios e armazéns.
                  </p>
                  {categoria === "imovel" && (
                    <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy-dark">
                      <Check className="h-3 w-3" /> Selecionado
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 2: INFORMAÇÕES */}
          {etapa === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-extrabold text-navy">
                  Passo 2: Informações de {categoria === "carro" ? "Veículo" : "Imóvel"}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Indique as características detalhadas para que o seu anúncio seja facilmente encontrado.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="titulo">
                  Título do Anúncio *
                </label>
                <input
                  id="titulo"
                  required
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder={
                    categoria === "carro"
                      ? "Ex.: Toyota Land Cruiser Prado TXL 2021"
                      : "Ex.: Moradia T4 com Piscina em Talatona"
                  }
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              {categoria === "carro" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Marca *</label>
                    <select
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    >
                      {MARCAS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Modelo *</label>
                    <input
                      type="text"
                      required
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      placeholder="Ex.: Hilux, Tucson, Prado..."
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    >
                    </input>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Ano de Fabrico *</label>
                    <input
                      type="number"
                      min={1990}
                      max={2027}
                      value={ano}
                      onChange={(e) => setAno(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Quilometragem (km)</label>
                    <input
                      type="number"
                      value={km}
                      onChange={(e) => setKm(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Ex.: 45000"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Combustível</label>
                    <select
                      value={combustivel}
                      onChange={(e) => setCombustivel(e.target.value as any)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    >
                      <option value="Gasolina">Gasolina</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Elétrico">Elétrico</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Transmissão</label>
                    <select
                      value={transmissao}
                      onChange={(e) => setTransmissao(e.target.value as any)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    >
                      <option value="Automática">Automática</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Tracção</label>
                    <select
                      value={tracao}
                      onChange={(e) => setTracao(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    >
                      <option value="4x4">4x4 / Integral</option>
                      <option value="4x2">4x2 / Traseira</option>
                      <option value="Dianteira">Dianteira</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Cor da Viatura</label>
                    <input
                      type="text"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                      placeholder="Ex.: Preto, Branco, Cinzento"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Tipo de Imóvel *</label>
                    <select
                      value={tipoImovel}
                      onChange={(e) => setTipoImovel(e.target.value as any)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    >
                      <option value="Moradia">Moradia / Vivenda</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Escritório">Escritório</option>
                      <option value="Loja">Loja Comercial</option>
                      <option value="Armazém">Armazém</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Finalidade</label>
                    <select
                      value={finalidade}
                      onChange={(e) => setFinalidade(e.target.value as any)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    >
                      <option value="Venda">Venda</option>
                      <option value="Arrendamento">Arrendamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Quartos</label>
                    <input
                      type="number"
                      min={0}
                      value={quartos}
                      onChange={(e) => setQuartos(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Casas de Banho</label>
                    <input
                      type="number"
                      min={0}
                      value={casasBanho}
                      onChange={(e) => setCasasBanho(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Área (m²)</label>
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Ex.: 250"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Lugares de Garagem</label>
                    <input
                      type="number"
                      min={0}
                      value={estacionamento}
                      onChange={(e) => setEstacionamento(Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="descricao">
                  Descrição Completa
                </label>
                <textarea
                  id="descricao"
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o estado, comodidades, revisões, documentos e facilidades..."
                  className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              {/* Características Extras */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">
                  Características / Equipamentos em Destaque
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novaCaracteristica}
                    onChange={(e) => setNovaCaracteristica(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarCaract())}
                    placeholder="Ex.: Ar condicionado, Gerador, Piscina, Vidros elétricos..."
                    className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={adicionarCaract}
                    className="rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy-dark"
                  >
                    Adicionar
                  </button>
                </div>
                {caracteristicas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {caracteristicas.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy"
                      >
                        {c}
                        <button
                          type="button"
                          onClick={() => removerCaract(c)}
                          className="ml-1 text-muted-foreground hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 3: PREÇO & LOCALIZAÇÃO */}
          {etapa === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-extrabold text-navy">Passo 3: Preço e Localização em Angola</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Defina o valor monetário em Kwanzas (Kz) e a província/bairro onde o bem se encontra.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="preco">
                    Preço (em Kz - AOA) *
                  </label>
                  <div className="relative">
                    <input
                      id="preco"
                      required
                      type="number"
                      min={1000}
                      value={preco}
                      onChange={(e) => setPreco(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Ex.: 45000000"
                      className="w-full rounded-lg border border-border bg-surface py-2.5 pl-3 pr-16 text-base font-bold text-navy outline-none focus:border-gold"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-extrabold text-gold-strong">
                      Kz (AOA)
                    </span>
                  </div>
                  {preco ? (
                    <p className="mt-1.5 text-xs font-semibold text-gold-strong">
                      Valor formatado: {formatPreco(Number(preco))}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy">Província *</label>
                  <select
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface py-2.5 px-3 text-sm text-navy outline-none focus:border-gold"
                  >
                    {PROVINCIAS.filter((p) => p !== "Todas").map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="bairro">
                    Bairro / Município / Zona *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      id="bairro"
                      required
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Ex.: Maianga, Talatona, Benfica, Morro Bento..."
                      className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy">Telemóvel para Contacto *</label>
                  <input
                    type="tel"
                    value={telefoneVendedor}
                    onChange={(e) => setTelefoneVendedor(e.target.value)}
                    placeholder="+244 9XX XXX XXX"
                    className="w-full rounded-lg border border-border bg-surface py-2.5 px-3 text-sm text-navy outline-none focus:border-gold"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Os interessados carregarão neste número para conversar via WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 4: FOTOGRAFIAS */}
          {etapa === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-extrabold text-navy">Passo 4: Fotografias do Anúncio</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Anúncios com boas fotografias recebem até 5x mais contactos. Pode carregar várias imagens e reordenar.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface p-8 text-center cursor-pointer transition-colors hover:border-gold hover:bg-gold/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-navy">
                  <Upload className="h-7 w-7" />
                </div>
                <p className="mt-3 text-sm font-bold text-navy">Clique para carregar fotos do computador ou telemóvel</p>
                <p className="mt-1 text-xs text-muted-foreground">Suporta imagens JPG, PNG ou WEBP</p>
                <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
              </label>

              {/* Galeria e Reordenação */}
              <div>
                <p className="mb-3 text-xs font-extrabold uppercase text-navy">
                  Fotos Selecionadas ({imagens.length}) — A primeira foto é a capa principal:
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {imagens.map((img, idx) => (
                    <div
                      key={img.slice(0, 30) + idx}
                      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                    >
                      <img src={img} alt={`Foto ${idx + 1}`} className="aspect-video w-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-[10px] font-extrabold text-navy-dark shadow">
                          Capa
                        </span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => moverImagem(idx, "cima")}
                            className="rounded bg-white p-1 text-xs font-bold text-navy hover:bg-gold"
                            title="Mover para a esquerda"
                          >
                            ←
                          </button>
                        )}
                        {idx < imagens.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moverImagem(idx, "baixo")}
                            className="rounded bg-white p-1 text-xs font-bold text-navy hover:bg-gold"
                            title="Mover para a direita"
                          >
                            →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removerImagem(idx)}
                          className="rounded bg-red-600 p-1 text-white hover:bg-red-700"
                          title="Remover"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 5: PRÉ-VISUALIZAÇÃO */}
          {etapa === 5 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-extrabold text-navy">Passo 5: Pré-visualização do Anúncio</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Confira como o seu anúncio será apresentado aos potenciais compradores no site.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                {/* Visualização Card & Imagens */}
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={imagens[0]}
                      alt={titulo}
                      className="aspect-video w-full object-cover"
                    />
                  </div>
                  <div className="mt-4">
                    <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-bold uppercase text-gold-strong">
                      {categoria === "carro" ? "Viatura à Venda" : `${tipoImovel} para ${finalidade}`}
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold text-navy">{titulo}</h3>
                    <p className="mt-1 text-xl font-extrabold text-navy">
                      {formatPreco(Number(preco) || 0)}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-gold-strong" /> {bairro} — {provincia}
                    </p>
                  </div>
                </div>

                {/* Resumo Especificações */}
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <h4 className="font-extrabold text-navy">Resumo Técnico</h4>
                  <ul className="mt-3 flex flex-col gap-2 text-xs">
                    {categoria === "carro" ? (
                      <>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Marca / Modelo:</span>
                          <span className="font-bold text-navy">{marca} {modelo}</span>
                        </li>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Ano:</span>
                          <span className="font-bold text-navy">{ano}</span>
                        </li>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Quilometragem:</span>
                          <span className="font-bold text-navy">{km ? `${Number(km).toLocaleString("pt-PT")} km` : "N/D"}</span>
                        </li>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Combustível:</span>
                          <span className="font-bold text-navy">{combustivel}</span>
                        </li>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Transmissão:</span>
                          <span className="font-bold text-navy">{transmissao}</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Tipo de Imóvel:</span>
                          <span className="font-bold text-navy">{tipoImovel}</span>
                        </li>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Finalidade:</span>
                          <span className="font-bold text-navy">{finalidade}</span>
                        </li>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Quartos / Casas de Banho:</span>
                          <span className="font-bold text-navy">{quartos} quartos • {casasBanho} banhos</span>
                        </li>
                        <li className="flex justify-between border-b border-border/50 pb-1.5">
                          <span className="text-muted-foreground">Área:</span>
                          <span className="font-bold text-navy">{area ? `${area} m²` : "N/D"}</span>
                        </li>
                      </>
                    )}
                    <li className="flex justify-between pt-1">
                      <span className="text-muted-foreground">Contacto WhatsApp:</span>
                      <span className="font-bold text-whatsapp">{telefoneVendedor || "Definido"}</span>
                    </li>
                  </ul>

                  {descricao && (
                    <div className="mt-4 border-t border-border/60 pt-3">
                      <p className="text-[11px] font-bold text-navy">Descrição:</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{descricao}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 6: CONFIRMAÇÃO & PUBLICAÇÃO */}
          {etapa === 6 && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold-strong">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-2xl font-extrabold text-navy">Tudo Pronto para Publicar!</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                O seu anúncio está completo e pronto para ser visualizado por milhares de compradores em toda Angola na
                plataforma G&C Solutions.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-navy hover:bg-surface"
                >
                  Rever Dados
                </button>
                <button
                  type="button"
                  onClick={publicarAnuncio}
                  className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-3 text-base font-extrabold text-navy-dark shadow-md transition-transform hover:bg-gold-strong active:scale-95"
                >
                  <PlusCircle className="h-5 w-5" /> Publicar Anúncio Agora
                </button>
              </div>
            </div>
          )}

          {/* Botões de Navegação entre Etapas */}
          {etapa < 6 && (
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              {etapa > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2 text-sm font-bold text-navy hover:bg-surface"
                >
                  <ArrowLeft className="h-4 w-4" /> Anterior
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy-dark transition-transform hover:bg-gold-strong active:scale-95"
              >
                {etapa === 5 ? (
                  <>
                    Avançar para Publicação <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Seguinte <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
