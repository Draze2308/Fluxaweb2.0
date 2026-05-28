# Fluxa Web 2.0

Versión web de Fluxa — productividad y finanzas personales.

## Stack

- **Vite + React 18 + TypeScript**
- **React Router v6** — navegación entre pantallas
- **Zustand** — estado global con persistencia en localStorage
- **Recharts** — gráficos en Resumen
- **Lucide React** — íconos
- **Sora + JetBrains Mono** — tipografía

## Pantallas

| Ruta | Pantalla |
|------|----------|
| `/home` | Inicio — tareas del día + hábitos |
| `/habits` | Hábitos — hoy / semana / todos |
| `/finance` | Finanzas — balance, planeados, movimientos |
| `/summary` | Resumen — gráficos + insights |
| `/profile` | Perfil — temas, config, upgrade Pro |

## Desarrollo local

```bash
npm install
npm run dev
```

## Deploy en Vercel

1. Push a GitHub
2. Importar repo en [vercel.com](https://vercel.com)
3. Framework: **Vite** (se detecta automático)
4. Deploy ✅

## Deploy en Netlify

1. Push a GitHub
2. Importar en [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy ✅

## Conectar al backend (futuro)

El store en `src/store/index.ts` usa datos seed hardcodeados.
Para conectar al FastAPI de Fluxa 2.0, reemplazar las funciones del store
con llamadas a la API usando `fetch` o `axios`.

Ejemplo:
```ts
// Reemplazar esto:
habits: seedHabits,

// Por esto:
const res = await fetch('http://localhost:8000/habits', {
  headers: { 'X-User-Id': userId }
})
habits: await res.json(),
```
