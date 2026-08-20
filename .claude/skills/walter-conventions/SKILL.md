---
name: walter-conventions
description: Walter's stack and project conventions, read live from the walter MCP server's pattern:// resources. Use when adding or changing anything in this repo - components, Tailwind theme tokens, Vite config, ESLint or tsconfig setup, images and asset loading, bundle size, dependency choices, or Firebase Hosting deploys and cache headers.
---

# Walter's conventions

This repo is the `react-vite-tailwind-firebase` stack: React 19 + TypeScript + Tailwind CSS 4
(via `@tailwindcss/vite`, no `tailwind.config.js`) + Vite + Firebase Hosting.

## Read the relevant pattern before writing

The conventions live in the `walter` MCP server, not in this file. Read the matching resource
with `ReadMcpResourceTool` (server `walter`) — read it, don't answer from memory of it. The docs
change without this skill changing.

| Task | Resource |
|---|---|
| Choosing a library or dependency, bumping TypeScript | `pattern://stack` |
| ESLint & tsconfig layout, comments, abstraction, definition of done | `pattern://conventions` |
| `firebase.json`, cache headers, `.firebaserc`, deploying | `pattern://deployment` |
| Images, SVGs, fonts, code splitting, vendor chunks, bundle size | `pattern://asset-optimization` |
| Pulling tokens or components out of a Claude Design project | `pattern://design-system` |

## Standing rules for this repo

- Design tokens live in `src/design-system/theme.css`, not `src/index.css` as `pattern://stack`
  describes generically. The three-layer structure there (raw palette → semantic → `@theme inline`)
  is the convention: components reference the semantic layer, not the raw ramp.
- `src/design-system/Walter - Homepage.reference.html` is the design source of truth. Diff against
  it rather than reinventing spacing or colour values.
- Done means `npm run build` and `npm run lint` both pass, *and* a UI change has been looked at
  rendered. Type-checking is not the same as the feature working. `npm run analyze` for bundle
  questions.
- Check Context7 for the current Vite, Tailwind, or React API before assuming a shape from memory.
- `walter:scaffold_project` creates a **new** project from a template. Never run it against this
  repo.
