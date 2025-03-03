import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    visualizer({
      filename: './stats.html', // Archivo donde se genera el análisis
      open: true, // Abre el reporte automáticamente al generar el bundle
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify', // Alias para stream
      buffer: 'buffer', // Alias para buffer
      util: 'util/', // Alias para util
      // Otros alias si es necesario
    },
  },
  define: {
    global: 'globalThis', // Asegúrate de que globalThis esté disponible
    'process.env': {},    // Asegura que process.env esté vacío para evitar errores de Node
  },
  optimizeDeps: {
    include: [
      'buffer',
      'crypto-browserify',
      'stream-browserify',
      'util',
      'events',
    ],
  },
});
