import { test } from "node:test";
import assert from "node:assert/strict";
import { DROGAS } from "../src/drogas.js";
import { calcularDosis, superficieCorporal } from "../src/dosis.js";

const droga = (id) => DROGAS.find((d) => d.id === id);

test("superficie corporal por Mosteller", () => {
  assert.equal(Math.round(superficieCorporal(25, 125) * 100) / 100, 0.93);
  assert.equal(superficieCorporal(36, 100), 1);
});

test("metotrexato por m², con tope de 25 mg", () => {
  assert.deepEqual(calcularDosis(droga("mtx"), { peso: 36, talla: 100 }),
    { min: 10, max: 15, topeado: false, sc: 1 });
  const grande = calcularDosis(droga("mtx"), { peso: 80, talla: 180 });
  assert.equal(grande.max, 25);
  assert.equal(grande.topeado, true);
});

test("metotrexato sin talla pide la talla", () => {
  assert.match(calcularDosis(droga("mtx"), { peso: 20 }).error, /talla/);
});

test("mg/kg con tomas y tope", () => {
  const r = calcularDosis(droga("npx"), { peso: 20, talla: null });
  assert.equal(r.min, 200);
  assert.equal(r.max, 400);
  assert.deepEqual(r.porToma, { min: 100, max: 200 });
  const r2 = calcularDosis(droga("npx"), { peso: 70 });
  assert.equal(r2.max, 1000);
  assert.equal(r2.topeado, true);
});

test("etanercept 0,8 mg/kg con tope de 50 mg", () => {
  assert.equal(calcularDosis(droga("eta"), { peso: 25 }).max, 20);
  assert.equal(calcularDosis(droga("eta"), { peso: 70 }).max, 50);
});

test("adalimumab por bandas, bordes inclusivos abajo", () => {
  assert.match(calcularDosis(droga("ada"), { peso: 9 }).error, /10 kg/);
  assert.equal(calcularDosis(droga("ada"), { peso: 10 }).max, 10);
  assert.equal(calcularDosis(droga("ada"), { peso: 15 }).max, 20);
  assert.equal(calcularDosis(droga("ada"), { peso: 29.9 }).max, 20);
  assert.equal(calcularDosis(droga("ada"), { peso: 30 }).max, 40);
});

test("tocilizumab IV poliarticular: mg/kg según banda", () => {
  assert.equal(calcularDosis(droga("toci-iv-p"), { peso: 20 }).max, 200);
  assert.equal(calcularDosis(droga("toci-iv-p"), { peso: 40 }).max, 320);
});

test("abatacept IV: 10 mg/kg debajo de 75 kg y dosis fija arriba", () => {
  assert.equal(calcularDosis(droga("aba-iv"), { peso: 40 }).max, 400);
  assert.equal(calcularDosis(droga("aba-iv"), { peso: 80 }).max, 750);
  assert.equal(calcularDosis(droga("aba-iv"), { peso: 120 }).max, 1000);
});

test("leflunomida debajo de 20 kg es cada 48 h", () => {
  assert.equal(calcularDosis(droga("lef"), { peso: 15 }).texto, "10 mg cada 48 horas");
});

test("peso faltante o absurdo da error", () => {
  assert.ok(calcularDosis(droga("ibu"), { peso: null }).error);
  assert.ok(calcularDosis(droga("ibu"), { peso: 0 }).error);
  assert.ok(calcularDosis(droga("ibu"), { peso: 500 }).error);
});

test("todas las drogas tienen fuente y calculan con 30 kg y 135 cm", () => {
  for (const d of DROGAS) {
    assert.ok(d.fuente, d.id);
    const r = calcularDosis(d, { peso: 30, talla: 135 });
    assert.ok(!r.error, `${d.id}: ${r.error}`);
    assert.ok(r.max > 0 && r.min <= r.max, d.id);
  }
});
