export function formatCompactCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function niceStep(raw: number) {
  const pow10 = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const base = raw / pow10;
  let niceBase = 1;
  if (base > 5) niceBase = 10;
  else if (base > 2) niceBase = 5;
  else if (base > 1) niceBase = 2;
  return niceBase * pow10;
}

export function buildNiceYAxis(data: Array<{ value: number }>, sections = 3) {
  const maxData = Math.max(0, ...data.map((d) => Number(d.value) || 0));
  const rawStep = maxData / (sections || 1);
  const stepValue = niceStep(rawStep || 1);
  const maxValue = stepValue * sections;
  const ticks: number[] = [];
  for (let i = 0; i <= sections; i++) ticks.push(i * stepValue);
  const yAxisLabelTexts = ticks.map(formatCompactCOP);
  return { maxValue, stepValue, yAxisLabelTexts };
}
