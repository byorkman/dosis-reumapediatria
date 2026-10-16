# Dosis en reumatología pediátrica

Calculadora web de dosis por peso y superficie corporal para las drogas más usadas en reumatología pediátrica. Pensada para usar desde el celular durante la consulta.

**No guarda ni envía datos.** Todo el cálculo se hace en el navegador.

> ⚠️ **La tabla de dosis tiene que ser revisada por un médico antes de usarse con pacientes.** Fue armada a partir de prospectos y guías de referencia, pero no reemplaza el prospecto vigente ni el criterio clínico.

## Cómo calcula

- **mg/kg:** peso × dosis, limitado a la dosis máxima.
- **mg/m²:** superficie corporal (Mosteller: √(talla cm × peso kg / 3600)) × dosis, limitado a la dosis máxima.
- **Por bandas de peso:** dosis fija (o mg/kg) según el rango de peso.
- Cuando la dosis diaria se reparte en tomas, muestra también la dosis por toma.

## Tabla de dosis

| Droga | Vía | Dosis | Frecuencia | Fuente |
|---|---|---|---|---|
| Metotrexato | VO / SC | 10 a 15 mg/m², máx. 25 mg | una vez por SEMANA | Ringold S, et al. ACR 2019 JIA guideline (Arthritis Care Res 2019;71:717-34) |
| Leflunomida | VO | < 20 kg: 10 mg cada 48 horas<br>20 a < 40 kg: 10 mg por día<br>≥ 40 kg: 20 mg por día | según banda de peso | Silverman E, et al. N Engl J Med 2005;352:1655-66 |
| Sulfasalazina | VO | 30 a 50 mg/kg/día, máx. 2000 mg | diaria, en 2 tomas | Prospecto (Azulfidine EN-tabs, FDA) |
| Hidroxicloroquina | VO | 5 mg/kg/día (máximo), máx. 400 mg | una vez por día | AAO 2016 (Marmor MF, et al. Ophthalmology 2016;123:1386-94) |
| Prednisona / prednisolona | VO | 0,5 a 2 mg/kg/día, máx. 60 mg | diaria, en 1 a 2 tomas | Dosis pediátrica habitual (BNF for Children) |
| Metilprednisolona (pulsos) | IV | 30 mg/kg/dosis, máx. 1000 mg | 1 dosis diaria, habitualmente 3 días | Dosis pediátrica habitual (BNF for Children) |
| Naproxeno | VO | 10 a 20 mg/kg/día, máx. 1000 mg | diaria, en 2 tomas | Prospecto (Naprosyn, FDA) y BNF for Children |
| Ibuprofeno | VO | 30 a 40 mg/kg/día, máx. 2400 mg | diaria, en 3 a 4 tomas | Prospecto (Motrin, FDA) para AIJ |
| Meloxicam | VO | 0,125 mg/kg/día, máx. 7,5 mg | una vez por día | Prospecto (Mobic, FDA), AIJ desde 2 años |
| Etanercept | SC | 0,8 mg/kg/semana, máx. 50 mg | una vez por semana | Prospecto (Enbrel, FDA) |
| Adalimumab | SC | 10 a < 15 kg: 10 mg cada 2 semanas<br>15 a < 30 kg: 20 mg cada 2 semanas<br>≥ 30 kg: 40 mg cada 2 semanas | cada 2 semanas | Prospecto (Humira, FDA) |
| Tocilizumab IV (AIJ poliarticular) | IV | < 30 kg: 10 mg/kg cada 4 semanas<br>≥ 30 kg: 8 mg/kg cada 4 semanas<br>máx. 800 mg | cada 4 semanas | Prospecto (Actemra, FDA) |
| Tocilizumab SC (AIJ poliarticular) | SC | < 30 kg: 162 mg cada 3 semanas<br>≥ 30 kg: 162 mg cada 2 semanas | según banda de peso | Prospecto (Actemra, FDA) |
| Tocilizumab IV (AIJ sistémica) | IV | < 30 kg: 12 mg/kg cada 2 semanas<br>≥ 30 kg: 8 mg/kg cada 2 semanas<br>máx. 800 mg | cada 2 semanas | Prospecto (Actemra, FDA) |
| Tocilizumab SC (AIJ sistémica) | SC | < 30 kg: 162 mg cada 2 semanas<br>≥ 30 kg: 162 mg por semana | según banda de peso | Prospecto (Actemra, FDA) |
| Abatacept IV | IV | < 75 kg: 10 mg/kg<br>75 a < 100 kg: 750 mg<br>≥ 100 kg: 1000 mg<br>máx. 1000 mg | semanas 0, 2 y 4, luego cada 4 semanas | Prospecto (Orencia, FDA) |
| Abatacept SC | SC | 10 a < 25 kg: 50 mg por semana<br>25 a < 50 kg: 87,5 mg por semana<br>≥ 50 kg: 125 mg por semana | una vez por semana | Prospecto (Orencia, FDA) |
| Anakinra | SC | 1 a 2 mg/kg/día, máx. 100 mg | una vez por día | ACR 2021 guideline AIJ sistémica (Onel KB, et al. Arthritis Rheumatol 2022;74:553-69) |
| Canakinumab | SC | 4 mg/kg, máx. 300 mg | cada 4 semanas | Prospecto (Ilaris, FDA) |

Los valores están en `src/drogas.js`. Para cambiar una dosis o agregar una droga se edita solo ese archivo.

## Desarrollo

Sitio estático, sin dependencias ni compilación.

```sh
npm test               # pruebas de los cálculos
npx serve .            # o cualquier servidor estático para verlo localmente
```

## Versión

La versión se ve al pie de la página. En cada cambio:

1. Agregar arriba en [`CHANGELOG.md`](CHANGELOG.md) una entrada `## X.Y.Z · día mes año` con lo que cambió.
2. Poner el mismo número en `package.json` y el mismo texto (`vX.Y.Z · día mes año`) en el pie de `index.html`.

Se sube el último número para arreglos y textos, el del medio para funciones nuevas y el primero para cambios grandes. `npm test` avisa si los tres lugares no coinciden.

## Publicar en Vercel

En Vercel: **Add New → Project → Import** este repositorio, con Framework Preset **Other** y sin comando de build. Cada cambio que entre a `main` se publica solo.
