# Eden Gardens

A responsive Slovak garden-architecture website built with **Next.js 16 App Router, React 19 and TypeScript**, inspired by the supplied Eden Gardens reference. Warm ivory, muted copper, restrained typography, landscape photography and generous spacing.

## Setup status

The complete application source is present. **Dependencies have not been installed successfully.** The saved npm registry initially returned `ENOTFOUND`; the latest installation attempt reached it but returned **`E401` (authentication required)**. No registry configuration, certificate setting or credentials were changed.

Refresh your corporate registry credentials locally using your organisation's approved procedure. Do not put tokens in this repository or share them in chat. Keep using your existing configured registry.

## Run locally

Requires **Node.js 22.18+** (Node 22 LTS recommended) and npm. No global packages or editor extensions are required.

From the project root, after your configured registry is accessible and authenticated:

```sh
npm install
npm run dev
```

Open **http://localhost:3000**. The installation uses the registry already saved on your computer; the project deliberately contains no registry override. Commit the generated lockfile after the first successful install. Package ranges allow compatible patch updates from your registry.

Production:

```sh
npm run build
npm start
```

This is a server-capable Next.js application, **not a static export**: the contact endpoint requires a Node.js runtime.

## Pages and interactions

- **Home:** manually controlled, optionally rotating hero; studio introduction; four services; selected projects.
- **Projects:** category filtering, six illustrative project detail pages, accessible full-screen photo galleries with arrow-key navigation and Escape to close.
- **Services:** four detailed offerings, process overview and service-prefilled contact links.
- **About:** studio philosophy and values.
- **Journal:** three complete garden/architecture articles with individual routes and metadata.
- **Contact:** client/server validation, inline accessible errors, submission states, genuine server processing and expandable FAQs.
- **Privacy, 404 and error pages**, responsive navigation, keyboard focus handling, reduced-motion styles, page metadata, sitemap and robots directives.
- **Scroll animations:** soft fade-and-lift section reveals, gentle image entrances and staggered service, project and journal cards.

The design uses system fonts to avoid an external font dependency. Native modal dialogs provide keyboard focus containment, Escape handling and focus restoration. Hero rotation is off by default and stops when a visitor enters it with a pointer or keyboard.

### Scroll motion

The small client entry point in [src/components/scroll-animations.tsx](src/components/scroll-animations.tsx) enhances the server-rendered pages without adding wrappers or animation dependencies. The controller in [src/lib/scroll-reveal.ts](src/lib/scroll-reveal.ts) uses one `IntersectionObserver` and the browser's Web Animations API; there are no continuous scroll handlers or custom scroll physics.

- Add `data-reveal="up"` to an existing section/card or `data-reveal="image"` to an image wrapper. Optional `data-reveal-delay="1"`, `"2"` or `"3"` gives a short stagger. Avoid nesting reveal targets.
- Tune the `--reveal-*` tokens in [src/app/globals.css](src/app/globals.css). Mobile uses shorter distances, durations and delays.
- An offscreen element animates once as it approaches the viewport. Content already visible on initial hydration, scroll restoration or insertion is not faded out. Page headings, hero/LCP images, forms and modal dialogs are left immediate.
- Content remains visible with JavaScript disabled or animation APIs unavailable. No hidden classes, `aria-hidden`, or layout-changing styles are used; animation effects are removed after completion.
- Reduced-motion preferences, including live changes, skip/cancel the effects. Keyboard focus and hash navigation reveal the relevant content immediately; printing also disables the effects.
- Streamed route content and newly inserted project cards are registered automatically. Removed elements, observers, animations and listeners are cleaned up.

## Contact form: real behavior, no simulated success

Copy the example environment configuration if needed:

```sh
cp .env.example .env.local
```

See [.env.example](.env.example) for all settings. Restart the development server after changing environment variables.

### Local development

When all email-delivery settings are empty and `NODE_ENV=development`, valid submissions are appended to a private, git-ignored NDJSON file inside the local `.data` directory. Every submission has a reference and timestamp. **No email is sent**, and the form explicitly says so. Use dummy data for testing and remove local submissions when no longer needed.

Partially configured email settings are treated as a configuration error, not permission to silently save locally.

### Email delivery

The server can send email through the Resend HTTP API using native `fetch`; no provider SDK is required. Set these **server-only** variables:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | A Resend API key with permission to send email |
| `CONTACT_FROM_EMAIL` | A single sender email address on a verified domain; no display-name wrapper |
| `CONTACT_TO_EMAIL` | The studio's receiving email address |

The visitor's email is used as `reply_to`, never as the sender. Messages are sent as plain text. The server reports acceptance only after the provider returns a successful receipt; provider acceptance is not a guarantee of final inbox delivery. Network failures and provider errors return an explicit failure, not a pretend success.

In production, missing configuration returns **HTTP 503**. There is **no production filesystem fallback**, because serverless filesystems are not durable and silent local storage could lose inquiries. The hosting environment must permit outbound HTTPS to the email provider.

### Public configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site origin, e.g. the deployed HTTPS domain; used for SEO and request-origin checking |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional public email link; empty values hide it |
| `NEXT_PUBLIC_CONTACT_PHONE` | Optional public telephone link; empty values hide it |

Do not prefix secrets with `NEXT_PUBLIC_`. Set the public values before building. If you use another development port or host, update `NEXT_PUBLIC_SITE_URL` to match it or leave it unset locally.

### Form protections

- Shared field validation on the client and server; messages are limited to 4,000 characters.
- Same-origin checks, JSON-only requests, a 12 KB streamed-body limit and a honeypot.
- Five requests per visitor per 15 minutes, with a `Retry-After` response on rejection.
- In-memory IP-derived rate-limit keys are bounded; raw IPs are not saved with inquiries.
- Email timeouts, private local file permissions, no-store API responses and no logging of message contents or credentials.

The limiter is **best-effort and per process**, not a distributed anti-abuse service. Before production, configure trusted forwarding headers and shared or hosting-level rate limits, especially with multiple server instances. Add a challenge system if real-world abuse warrants it. A public inquiry form is not authenticated; origin checks alone do not prevent automated spam.

## Content and photographs

**All project descriptions, areas and locations remain illustrative.** The selected photographs do not verify the sample projects or claim to document those commissions. This is disclosed in the interface. No real business address, phone, awards, testimonials or press coverage have been invented.

Edit [src/lib/content.ts](src/lib/content.ts) for project, service, journal and navigation content. The seven shared photos now come from the public **ÁTRIOVÁ záhrada** board on the [requested Eden Gardens Pinterest profile](https://sk.pinterest.com/edengardens_atelier/_saved/). Each image has its source pin recorded beside its URL. The first hero photo matches the supplied Pinterest share link.

Images use direct HTTPS `i.pinimg.com/originals/` URLs with Next.js image optimisation. A `pin.it` share link or Pinterest pin-page URL returns a webpage, not an image, and must not be used as an image source. Only the original-image host and path are allowed in [next.config.ts](next.config.ts); restart the development server or redeploy after changing that configuration. The browser/server needs access to Pinterest's image CDN; no photographs are bundled locally and the remote URLs can change or become unavailable.

Public pins are **not a licence to republish**. Confirm the photographer/rightsholder's permission before publication, retain required credits, and preferably serve the approved original files from storage you control. Existing image marks have not been edited out. Replace sample copy with verified studio information and remove the illustrative labels only after confirming the photos actually correspond to the listed projects.

The privacy page is explicitly a **demo notice**, not a finished legal policy for a particular company. Before collecting real inquiries publicly, replace it with the actual controller's details, legal basis, retention policy, processor information and applicable rights. The application does not include analytics or advertising cookies.

## Checks

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

`npm run check` runs all four in sequence. Native Node tests can run **without installing dependencies**; linting, full typechecking and building require the npm packages.

The test suite covers validation and malformed input, origin/content-type/body-size controls, honeypot and rate limiting, local persistence, provider success/failure, honest production configuration errors, navigation destinations and content integrity. Provider tests are mocked and send no real email. Temporary test files are deleted after each test.

### Validation performed during setup

- **36/36 native tests passed.**
- **36 TypeScript/TSX files passed a syntax-only check** with the TypeScript compiler already bundled with VS Code; JSON configuration parsed successfully.
- The editor reported no errors in the inspected source files.
- Native dialog focus containment and restoration were verified in an isolated browser fixture.
- **18 isolated layout checks passed** across homepage, portfolio and contact fixtures at 320, 360, 390, 768, 1024 and 1440 px, using the actual stylesheet. A tablet image overflow was found and corrected. These fixtures do not execute React or Next.js.
- Garden photograph URLs were inspected and loaded in the browser; Next.js server-side image optimisation remains untested until the framework runs.
- A full dependency-aware typecheck, ESLint run, Next.js build and live-application browser test remain blocked by registry authentication. Syntax-only checks are **not** a substitute for these.

The original scroll-animation test and compiler reruns were skipped. During the Pinterest photo replacement, **44/44 native tests passed**, including the scroll timing tests and new checks for direct image URLs and the Next.js image allowlist. All seven selected original images loaded and decoded in an isolated browser gallery; their source pins and dimensions were inspected. This does not verify Next.js server-side optimisation or the updated Vercel deployment. Editor diagnostics still report missing local Node typings; dependency-aware typechecking and a production build remain outstanding.

VS Code tasks for tests, development, production build and all checks are available in [.vscode/tasks.json](.vscode/tasks.json). Use **Terminal → Run Task**. The development task is ready for use after dependencies are installed.

## Before deployment

1. Restore access to the saved npm registry, install dependencies, commit the lockfile and run all checks.
2. Replace illustrative content and photographs with approved business assets.
3. Set the real public URL and contact details before building.
4. Configure and verify real email delivery, including a test received in the intended inbox.
5. Complete the privacy notice, data-retention process and required business identification.
6. Configure production anti-abuse controls and trusted proxy headers.
7. Test the running application on desktop/mobile, keyboard navigation, image loading, every route, form validation and actual delivery. Do not treat the isolated source/CSS checks as an end-to-end test.