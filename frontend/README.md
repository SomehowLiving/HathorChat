# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# 1. Navigate to your project’s frontend folder
cd /path/to/HathorChat/frontend

# 2. Initialize a Vite React project in-place
npm init vite@latest . -- --template react
    The . after npm init vite@latest tells Vite to scaffold into the current folder instead of creating a new subfolder.

# 3. Install dependencies
npm install

# 4. Add blockchain & UI libraries
npm install @hathor/wallet-lib bip39 bootstrap
    @hathor/wallet-lib is the library that lets you interact with the Hathor blockchain.
    bip39 will help us generate the seed phrase.
# 5. (Optional) Install React Router if you plan multi-page flows
npm install react-router-dom

# 6. Start the development server
npm run dev

# bip39 uses Node.js internals (like Buffer), but you’re running it in the browser, where Buffer is not available by default.

    ✅ Quick Fix: Polyfill Buffer for the Browser
    We’ll use the buffer package (which is browser-compatible) and inject it for bip39 to work.


npm install buffer
