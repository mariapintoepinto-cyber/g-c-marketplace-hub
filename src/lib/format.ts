export function formatKz(valor: number) {
  return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(valor)} Kz`;
}

export function formatKm(valor: number) {
  return `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(valor)} km`;
}

export function formatPreco(valor: number, finalidade?: string) {
  return finalidade === "Arrendamento" ? `${formatKz(valor)}/mês` : formatKz(valor);
}
