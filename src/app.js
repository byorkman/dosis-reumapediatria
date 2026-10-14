import { DROGAS, GRUPOS } from "./drogas.js";
import { calcularDosis, superficieCorporal } from "./dosis.js";

const lista = document.getElementById("lista");
const fmt = (n) => n.toLocaleString("es-AR", { maximumFractionDigits: 2 });

function numero(id) {
  const v = document.getElementById(id).value.trim().replace(",", ".");
  return v === "" ? null : Number(v);
}

function rango(min, max) {
  return min === max ? `${fmt(min)} mg` : `${fmt(min)} a ${fmt(max)} mg`;
}

function esquemaTexto(d) {
  const e = d.esquema;
  if (e.tipo === "bandas") return "Dosis según peso";
  const r = e.min === e.max ? fmt(e.min) : `${fmt(e.min)} a ${fmt(e.max)}`;
  return `${r} ${d.unidad}` + (e.tope ? ` · máx. ${fmt(e.tope)} mg` : "");
}

function tarjeta(d, datos) {
  const r = calcularDosis(d, datos);
  let resultado;
  if (r.error) {
    resultado = `<div class="pendiente">${r.error}</div>`;
  } else {
    resultado = `<div class="dosis">${!r.texto ? rango(r.min, r.max) : r.porKg ? `${rango(r.min, r.max)}<span> (${r.texto})</span>` : r.texto}</div>`;
    if (r.porToma) resultado += `<div class="toma">Por toma: ${rango(r.porToma.min, r.porToma.max)}</div>`;
    if (r.topeado) resultado += `<div class="tope">Limitado a la dosis máxima</div>`;
  }
  return `
    <details class="droga">
      <summary>
        <div class="cab"><span class="nombre">${d.nombre}</span><span class="via">${d.via}</span></div>
        ${resultado}
        <div class="frec">${d.frecuencia}</div>
        ${d.alerta ? `<div class="alerta">${d.alerta}</div>` : ""}
      </summary>
      <div class="extra">
        <div>${esquemaTexto(d)}</div>
        ${d.notas ? `<div>${d.notas}</div>` : ""}
        <div class="fuente">Fuente: ${d.fuente}</div>
      </div>
    </details>`;
}

function normalizar(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function actualizar() {
  const datos = { peso: numero("peso"), talla: numero("talla") };
  const filtro = normalizar(document.getElementById("buscar").value.trim());

  document.getElementById("sc").textContent =
    datos.peso > 0 && datos.talla > 0
      ? `Superficie corporal: ${fmt(Math.round(superficieCorporal(datos.peso, datos.talla) * 100) / 100)} m²`
      : "";

  lista.innerHTML = GRUPOS.map((g) => {
    const drogas = DROGAS.filter((d) => d.grupo === g && normalizar(d.nombre).includes(filtro));
    if (!drogas.length) return "";
    return `<h2>${g}</h2>` + drogas.map((d) => tarjeta(d, datos)).join("");
  }).join("") || `<p class="pendiente">No hay drogas con ese nombre.</p>`;
}

document.getElementById("form").addEventListener("input", actualizar);
actualizar();
