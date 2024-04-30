// vite.config.mts
import AutoImport from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/unplugin-auto-import@0.17.5/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.21/node_modules/unplugin-vue-components/dist/vite.js";
import Fonts from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/unplugin-fonts@1.1.1_vite@5.2.7/node_modules/unplugin-fonts/dist/vite.mjs";
import Layouts from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/vite-plugin-vue-layouts@0.10.0_vite@5.2.7_vue-router@4.3.0_vue@3.4.21/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import Vue from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.2.7_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/unplugin-vue-router@0.7.0_vue-router@4.3.0_vue@3.4.21/node_modules/unplugin-vue-router/dist/vite.mjs";
import Vuetify, { transformAssetUrls } from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/vite-plugin-vuetify@2.0.3_vite@5.2.7_vue@3.4.21_vuetify@3.5.14/node_modules/vite-plugin-vuetify/dist/index.mjs";
import nodePolyfills from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/vite-plugin-node-stdlib-browser@0.2.1_node-stdlib-browser@1.2.0_vite@5.2.7/node_modules/vite-plugin-node-stdlib-browser/index.cjs";
import { defineConfig } from "file:///home/pratap/fyre-v2-frontend/node_modules/.pnpm/vite@5.2.7_@types+node@20.12.3_sass@1.72.0/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///home/pratap/fyre-v2-frontend/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    VueRouter(),
    Layouts(),
    Vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss"
      }
    }),
    Components(),
    Fonts({
      google: {
        families: [{
          name: "Roboto",
          styles: "wght@100;300;400;500;700;900"
        }]
      }
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router"
      ],
      dts: true,
      eslintrc: {
        enabled: true
      },
      vueTemplate: true
    }),
    nodePolyfills()
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    },
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue"
    ]
  },
  server: {
    port: 9002
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvcHJhdGFwL2Z5cmUtdjItZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3ByYXRhcC9meXJlLXYyLWZyb250ZW5kL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcmF0YXAvZnlyZS12Mi1mcm9udGVuZC92aXRlLmNvbmZpZy5tdHNcIjsvLyBQbHVnaW5zXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCBGb250cyBmcm9tICd1bnBsdWdpbi1mb250cy92aXRlJ1xuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xuaW1wb3J0IFZ1ZXRpZnksIHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSAndml0ZS1wbHVnaW4tdnVldGlmeSdcbmltcG9ydCBub2RlUG9seWZpbGxzIGZyb20gJ3ZpdGUtcGx1Z2luLW5vZGUtc3RkbGliLWJyb3dzZXInXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIFZ1ZVJvdXRlcigpLFxuICAgIExheW91dHMoKSxcbiAgICBWdWUoe1xuICAgICAgdGVtcGxhdGU6IHsgdHJhbnNmb3JtQXNzZXRVcmxzIH0sXG4gICAgfSksXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5LWxvYWRlci90cmVlL21hc3Rlci9wYWNrYWdlcy92aXRlLXBsdWdpbiNyZWFkbWVcbiAgICBWdWV0aWZ5KHtcbiAgICAgIGF1dG9JbXBvcnQ6IHRydWUsXG4gICAgICBzdHlsZXM6IHtcbiAgICAgICAgY29uZmlnRmlsZTogJ3NyYy9zdHlsZXMvc2V0dGluZ3Muc2NzcycsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIENvbXBvbmVudHMoKSxcbiAgICBGb250cyh7XG4gICAgICBnb29nbGU6IHtcbiAgICAgICAgZmFtaWxpZXM6IFsge1xuICAgICAgICAgIG5hbWU6ICdSb2JvdG8nLFxuICAgICAgICAgIHN0eWxlczogJ3dnaHRAMTAwOzMwMDs0MDA7NTAwOzcwMDs5MDAnLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICBdLFxuICAgICAgZHRzOiB0cnVlLFxuICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgICB9KSxcbiAgICBub2RlUG9seWZpbGxzKClcbiAgXSxcbiAgZGVmaW5lOiB7ICdwcm9jZXNzLmVudic6IHt9IH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgICBleHRlbnNpb25zOiBbXG4gICAgICAnLmpzJyxcbiAgICAgICcuanNvbicsXG4gICAgICAnLmpzeCcsXG4gICAgICAnLm1qcycsXG4gICAgICAnLnRzJyxcbiAgICAgICcudHN4JyxcbiAgICAgICcudnVlJyxcbiAgICBdLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA5MDAyLFxuICB9LFxuICBidWlsZDp7XG4gICAgY29tbW9uanNPcHRpb25zOiB7IHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlIH0gXG5cbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sV0FBVywwQkFBMEI7QUFDNUMsT0FBTyxtQkFBbUI7QUFHMUIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxlQUFlLFdBQVc7QUFaZ0ksSUFBTSwyQ0FBMkM7QUFlcE4sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQ1IsSUFBSTtBQUFBLE1BQ0YsVUFBVSxFQUFFLG1CQUFtQjtBQUFBLElBQ2pDLENBQUM7QUFBQTtBQUFBLElBRUQsUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLFFBQ04sWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLE1BQU07QUFBQSxNQUNKLFFBQVE7QUFBQSxRQUNOLFVBQVUsQ0FBRTtBQUFBLFVBQ1YsTUFBTTtBQUFBLFVBQ04sUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQSxhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLFFBQVEsRUFBRSxlQUFlLENBQUMsRUFBRTtBQUFBLEVBQzVCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFNO0FBQUEsSUFDSixpQkFBaUIsRUFBRSx5QkFBeUIsS0FBSztBQUFBLEVBRW5EO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
