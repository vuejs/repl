import { Plugin, defineConfig, mergeConfig } from 'vite'
// import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  plugins: [
    // viteSingleFile()
  ],
  base: './',
  
  build: {
    outDir: __dirname + "/chii",
    lib: { entry: "./front_end/entrypoints/chii_app/chii_app.js", formats: ["es"], name: "chii" },
  },
})
