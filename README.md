# Mason Farrington — Portfolio

Portfolio website for **Mason Farrington**, a multidisciplinary artist (actor, musician, singer, designer, model).

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type check |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Testing (TDD)

This project uses test-driven development: write a failing test, make it pass, then refactor. A pre-commit hook runs lint, type check and tests, and GitHub Actions runs them (plus the build) on every push and PR. See [docs/architecture.md](docs/architecture.md#testing--tdd).

## Project structure

```
app/          routes only (pages, layouts, globals.css)
components/   layout, UI primitives and page sections
content/      all editable copy and data
lib/          fonts and helpers
types/        shared TypeScript types
public/       images and the resume PDF
e2e/          Playwright end-to-end tests
docs/         project documentation and mockups
```

The full conventions are in [docs/architecture.md](docs/architecture.md). Progress is tracked in [docs/roadmap.md](docs/roadmap.md).

## Editing content

Text, stats, links, videos and gallery items live in `content/`. Change them there, not inside components. Images go in `public/images/<page>/`.

## Documentation

| Doc | What's in it |
|---|---|
| [Project brief](docs/project-brief.md) | Goals, scope, pages, timeline |
| [Roadmap](docs/roadmap.md) | Phased plan and progress |
| [Architecture](docs/architecture.md) | Stack, folder structure, conventions, git workflow |
| [Design system](docs/design-system.md) | Colors, typography, layout, components |
| [Decisions](docs/decisions.md) | Log of technical and product decisions |
| [Content checklist](docs/content-checklist.md) | Assets and copy needed from the client |
| [Open questions](docs/open-questions.md) | Follow-ups for the client |
| [Mockups](docs/Mockups/) | Desktop designs: Home, About, Media, Contact |

## Deployment

Deployed on [Vercel](https://vercel.com) (proposed). Every branch gets a preview URL for client review.
