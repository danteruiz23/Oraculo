# 🔮 Oráculo — Fútbol Sala de los Martes

App simple para que los jugadores confirmen su asistencia al partido de fútbol sala
de los **martes de 7:30 a 8:30 PM**. Cada jugador entra con su nombre y marca **SÍ VOY** o
**NO VOY** para la próxima fecha. Todos ven en vivo quién confirmó.

Basada en ScoreMaster 2026, pero mucho más sencilla y con tema azul/morado.

## Funciones
- Login sin PIN (dropdown de nombres)
- Confirmación de asistencia para la próxima fecha (se calcula sola el próximo martes)
- Contadores en vivo: van / no van / sin responder, con lista de cada grupo
- Agregar jugadores (solo admin)
- Instalable como app (PWA) en el celular
- Real-time sync con Supabase

## Infraestructura
- **Supabase** (proyecto `Oraculo`, ref `cqinovwhmhjsrtwdnjis`): jugadores, PINs y asistencia
  - Tablas: `participants`, `attendance`
  - Pool: `oraculo`
- **Vercel**: hosting estático con build-time env var injection
- **GitHub**: repositorio del código

## Seguridad

### ✅ Secretos protegidos
Las credenciales de Supabase y la clave de admin **NO están en el código**.
Se inyectan en tiempo de build desde variables de entorno de Vercel.

**Env vars requeridas en Vercel:**
- `VITE_SUPABASE_URL` → URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` → Anon key del proyecto Supabase
- `VITE_ADMIN_KEY` → Clave de admin (ej: `2372`)

**Local development:**
1. Copia `.env.example` a `.env.local`
2. Llena con tus valores
3. Corre `node build.js` antes de abrir en el navegador

### ✅ Row-Level Security (RLS)
Supabase RLS **DEBE** estar activo para proteger los datos:

**En la tabla `participants`:**
```sql
-- Solo el anon key puede leer (público)
CREATE POLICY "anon_read_participants" ON participants
  FOR SELECT USING (true);

-- Solo admin puede escribir
CREATE POLICY "admin_write_participants" ON participants
  FOR INSERT, UPDATE, DELETE USING (
    current_setting('request.headers')::jsonb->>'authorization' LIKE '%admin_token%'
  );
```

**En la tabla `attendance`:**
```sql
-- Usuarios pueden leer su propia asistencia
CREATE POLICY "user_read_own_attendance" ON attendance
  FOR SELECT USING (user_id = current_user_id());

-- Usuarios pueden escribir su propia asistencia
CREATE POLICY "user_write_own_attendance" ON attendance
  FOR INSERT, UPDATE USING (user_id = current_user_id());
```

> Ver `SECURITY.md` para detalles completos de RLS.

### ✅ XSS Prevention
Nombres de jugadores se sanitizan antes de renderizar para evitar inyección de HTML/JS.
Usa `textContent` en lugar de `innerHTML` para todo lo que venga del usuario.

## Instalación local

```bash
# Clonar repo
git clone https://github.com/danteruiz23/Oraculo.git
cd Oraculo

# Copiar env template
cp .env.example .env.local

# Llenar .env.local con tus valores de Supabase

# Inyectar variables en index.html
node build.js

# Servir localmente
python -m http.server 8000
# o
npx http-server

# Abrir en http://localhost:8000
```

## Deploy en Vercel

1. Conectar el repo en Vercel
2. En Settings → Environment Variables, agregar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_KEY`
3. Build Command: `node build.js`
4. Output Directory: `.` (raíz)
5. Deploy

## Jugadores iniciales (16 — Fulbito de los Martes)
Dante Ruiz, German Tissera, Mario Vidal, Nestor Garrafa, Leonardo Odello, Armando Mora,
Jason Luckmann, JM Pepe, Leo Almeyda, Denys Herrera, Guillermo Canete, Alvaro Inthamoussu,
Arturo Garcia, Ronald Rosales, Carlo-Claro, Martin Pannunzio.

## Archivos
- `index.html` — la app completa (un solo archivo + env injection)
- `manifest.json` — PWA manifest
- `sw.js` — Service Worker
- `build.js` — Script que inyecta env vars en `index.html` (Vercel build)
- `.env.example` — Template de variables de entorno

## Notas
- Zona horaria: **America/New_York** (EST/EDT)
- Quórum: **12 confirmaciones** mínimo para formar equipo
- Admin key default: `2372` (cámbiala en Vercel)

## Changelog

### v2.0 (Security fixes)
- ✅ Secretos movidos a env vars (build-time injection)
- ✅ XSS prevention con sanitización de nombres
- ✅ RLS documentation para Supabase
- ✅ Build script para local dev
- ✅ .gitignore con .env
