// Cálculo de dosis a partir de la tabla de drogas.

// Superficie corporal por fórmula de Mosteller: √(talla cm × peso kg / 3600).
export function superficieCorporal(pesoKg, tallaCm) {
  return Math.sqrt((tallaCm * pesoKg) / 3600);
}

function redondear(n, decimales = 1) {
  const f = 10 ** decimales;
  return Math.round(n * f) / f;
}

function aplicarTope(mg, tope) {
  if (tope === undefined || mg <= tope) return { mg, topeado: false };
  return { mg: tope, topeado: true };
}

// Devuelve { min, max, topeado, porToma?, texto?, sc?, error? } en mg.
export function calcularDosis(droga, { peso, talla }) {
  if (!(peso > 0)) return { error: "Ingresá el peso" };
  if (peso > 200) return { error: "Revisá el peso" };
  const e = droga.esquema;

  if (e.tipo === "mgkg" || e.tipo === "m2") {
    let base = peso;
    let sc;
    if (e.tipo === "m2") {
      if (!(talla > 0)) return { error: "Para esta droga hace falta la talla" };
      if (talla > 230) return { error: "Revisá la talla" };
      sc = redondear(superficieCorporal(peso, talla), 2);
      base = sc;
    }
    const lo = aplicarTope(base * e.min, e.tope);
    const hi = aplicarTope(base * e.max, e.tope);
    const r = {
      min: redondear(lo.mg),
      max: redondear(hi.mg),
      topeado: lo.topeado || hi.topeado,
      sc,
    };
    if (droga.tomas) {
      r.porToma = { min: redondear(r.min / droga.tomas), max: redondear(r.max / droga.tomas) };
    }
    return r;
  }

  if (e.tipo === "bandas") {
    const banda = e.bandas.find((b) => peso >= b.desde && peso < b.hasta);
    if (!banda) return { error: `No indicado por debajo de ${e.bandas[0].desde} kg` };
    const bruto = banda.mgkg !== undefined ? peso * banda.mgkg : banda.dosis;
    const { mg, topeado } = aplicarTope(bruto, e.tope);
    return { min: redondear(mg), max: redondear(mg), topeado, texto: banda.texto, porKg: banda.mgkg !== undefined };
  }

  throw new Error(`Esquema desconocido: ${e.tipo}`);
}
