import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { comlink } from "vite-plugin-comlink";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    comlink(),
    wasm(),
    topLevelAwait(),
  ],
  worker:{
    plugins:[
      comlink(),
      wasm(),
      topLevelAwait(),
    ]
  }
})
