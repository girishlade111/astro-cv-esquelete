import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site: https://girishlade111.github.io/astro-cv-esquelete/
  site: "https://girishlade111.github.io",
  base: "/astro-cv-esquelete",
  integrations: [tailwind(), icon(), compress()],
  output: "static",
});
