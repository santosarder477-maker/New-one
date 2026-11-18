import { loadFont } from "@remotion/fonts";
// Open-source fonts (SIL Open Font License 1.1) bundled from npm via @fontsource,
// so rendering never depends on reaching an external font server.
import bebas400 from "@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2";
import playfair400i from "@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff2";
import playfair700i from "@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff2";
import inter300 from "@fontsource/inter/files/inter-latin-300-normal.woff2";
import inter500 from "@fontsource/inter/files/inter-latin-500-normal.woff2";
import inter700 from "@fontsource/inter/files/inter-latin-700-normal.woff2";

export const display = "Bebas Neue";
export const serif = "Playfair Display";
export const sans = "Inter";

const faces: { family: string; url: string; weight: string; style: string }[] = [
  { family: display, url: bebas400, weight: "400", style: "normal" },
  { family: serif, url: playfair400i, weight: "400", style: "italic" },
  { family: serif, url: playfair700i, weight: "700", style: "italic" },
  { family: sans, url: inter300, weight: "300", style: "normal" },
  { family: sans, url: inter500, weight: "500", style: "normal" },
  { family: sans, url: inter700, weight: "700", style: "normal" },
];

for (const f of faces) {
  loadFont({ family: f.family, url: f.url, weight: f.weight, style: f.style });
}
