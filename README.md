# 🔮 Oráculo — Fútbol Sala de los Martes

App simple para que los jugadores confirmen su asistencia al partido de fútbol sala
de los **martes de 7:30 a 8:30 PM**. Cada jugador entra con su PIN y marca **SÍ VOY** o
**NO VOY** para la próxima fecha. Todos ven en vivo quién confirmó.

Basada en ScoreMaster 2026, pero mucho más sencilla y con tema azul/morado.

## Funciones
- Login con PIN de 4 dígitos (mismos jugadores y PINs de *Fulbito de los Martes*).
- Confirmación de asistencia para la próxima fecha (se calcula sola el próximo martes).
- Contadores en vivo: van / no van / sin responder, con lista de cada grupo.
- Agregar jugadores (solo admin), cada uno con su propio PIN.
- Instalable como app (PWA) en el celular.

## Infraestructura
- **Supabase** (proyecto `Oraculo`, ref `cqinovwhmhjsrtwdnjis`): jugadores, PINs y asistencia.
  - Tablas: `participants`, `attendance`. Función `verify_pin` (login seguro en servidor).
  - Pool: `oraculo`.
- **Vercel**: hosting estático.
- **GitHub**: repositorio del código.

> La llave de Supabase incluida en `index.html` es la **anon key** (pública por diseño).
> Los PINs nunca se exponen: se validan en el servidor vía `verify_pin`.

## Jugadores iniciales (16 — Fulbito de los Martes)
Dante Ruiz, German Tissera, Mario Vidal, Nestor Garrafa, Leonardo Odello, Armando Mora,
Jason Luckmann, JM Pepe, Leo Almeyda, Denys Herrera, Guillermo Canete, Alvaro Inthamoussu,
Arturo Garcia, Ronald Rosales, Carlo-Claro, Martin Pannunzio.

## Archivos
- `index.html` — la app completa (un solo archivo).
- `manifest.json` / `sw.js` — soporte PWA.
