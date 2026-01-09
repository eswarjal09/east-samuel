# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running the Project

### Prerequisites
- Node.js and npm
- Python and Conda
- Conda environment `personal-llm` (or similar with FastAPI installed)

### Backend
1. Open a terminal.
2. Activate your conda environment:
   ```bash
   conda activate personal-llm
   ```
3. Navigate to the backend directory:
   ```bash
   cd backend
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run at `http://localhost:8000`.

### Frontend
1. Open a new terminal.
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

## Deployment Configuration

This application is configured to use Environment Variables for deployment.

### Backend Variables
- `DATABASE_URL`: Connection string for the PostgreSQL database (e.g., from Neon or Supabase).
    - If not set, it defaults to local SQLite (`sqlite:///./macrofactor.db`).

### Frontend Variables
- `VITE_API_URL`: The full URL of your deployed backend API (e.g., `https://api.eswar-health.com`).
    - If not set, it defaults to `http://localhost:8000`.
