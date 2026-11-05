# askapade

On-demand marketplace app design, built from the Founding PRD and Copy Guide.

- `app/`: clickable web prototype (React, Vite, motion, MapLibre). A panel beside the phone jumps to every flow and state.
- `figma/`: image assets, icon bundle and named image hashes used to build the Figma file natively.
- `fonts/`: Apfel Grotezk and Aileron converted to TTF for desktop and Figma (OFL and CC0).

```bash
cd app
npm install --legacy-peer-deps
npm run dev -- --port 5174
```

Then open http://localhost:5174.

Figma: the design system (variables, text styles, 149 components) and all 60 screens live in the Askapade file. The map markers are placeholders from Fluent Emoji Flat (MIT) until the bespoke 2D set is drawn.
