# BotellonesMX - Guia rapida de deploy

## 1. Base de datos MySQL

1. Crea una base de datos MySQL en Railway, Aiven, Clever Cloud o el hosting que prefieras.
2. Ejecuta el archivo `backend/database.sql`.
3. Guarda estos datos porque se usan en el backend:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

## 2. Backend en Render

1. Sube el repositorio a GitHub.
2. En Render crea un nuevo Web Service desde el repositorio.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Variables de entorno:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
7. Abre la URL del backend y prueba `/api/db-test`.

## 3. Frontend en Vercel

1. Crea un nuevo proyecto en Vercel desde el mismo repositorio.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `build`
5. Variable de entorno:
   - `REACT_APP_API_URL=https://URL-DE-TU-BACKEND/api`
6. Publica el proyecto.

## 4. Cuentas para la rubrica

- Admin: `admin@botellonesmx.com` / `Admin123!`
- Usuario 1: `usuario1@botellonesmx.com` / `Usuario123!`
- Usuario 2: `usuario2@botellonesmx.com` / `Cliente123!`
