// src/utils/inssId.ts
let counterByYear: Record<number, number> = {};

export function generateInssId(): string {
  const year = new Date().getFullYear();

  // inicializa o contador do ano atual, se não existir
  if (!counterByYear[year]) {
    counterByYear[year] = 0;
  }

  // incrementa o contador
  counterByYear[year]++;

  // trava o tamanho em 5 dígitos (00001 .. 99999)
  if (counterByYear[year] > 99999) {
    throw new Error(`Sequência esgotada para ${year} (>99999).`);
  }

  const five = String(counterByYear[year]).padStart(5, "0");
  return `INSS-${year}-${five}`;
}
