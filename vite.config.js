import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Emit every image, font and video as its own cacheable file instead of
    // base64-inlining small ones into the render-blocking HTML/CSS.
    assetsInlineLimit: 0,
  },
});
