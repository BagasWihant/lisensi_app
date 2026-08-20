# License App Agent Guidelines

This document provides guidelines for AI agents working on the License App project.

## Core Technologies
- **Framework:** Next.js (App Router)
- **Database:** TiDB Serverless (`@tidbcloud/serverless`)
- **Authentication:** Stateless JWT using `jose` and HttpOnly cookies.
- **Styling:** Tailwind CSS, adhering strictly to the Apple Design System guidelines.

## Architectural Rules
1. **API Handlers:** Place all API logic in `app/api/...`. Use Next.js route handlers.
2. **Database:** Use `@tidbcloud/serverless` for HTTP-based connection to TiDB Serverless. Avoid heavy ORMs. The database connection logic should be singleton and stored in `lib/db.ts`.
3. **Authentication:** 
   - Protect dashboard routes using Next.js Middleware (`middleware.ts`).
   - Use `jose` for JWT sign/verify since it's compatible with Edge Runtime.
4. **Server Actions:** Use Next.js Server Actions for all data mutations (Create, Update, Delete licenses) in the admin dashboard.

## Business Logic Rules
- **License Generation:** When creating a new license, the `license_id` MUST be automatically generated as a random string of exactly 15 characters.
- **License Status:** The default status for a new license is `on`.
- **Validation:** The `/api/validate` endpoint must only return `{ "valid": true }` if the license exists AND its status is `on`.

## UI/UX Guidelines (Apple Design System)
We follow a strict photography-first, minimalist design as defined in `apple-DESIGN.md`:
- **Colors:** Use `Action Blue` (#0066cc) for all interactive elements. No secondary brand colors.
- **Typography:** SF Pro Display/Text (use `system-ui, -apple-system, sans-serif` in Tailwind).
- **Components:** 
  - Use full-pill (`rounded-full`) for primary CTAs.
  - Use `store-utility-card` style for dashboard lists (radius `18px`, 1px hairline border, white background).
- **Elevation:** Avoid shadows entirely on UI elements. Only use the system drop-shadow on product photography.
- **Spacing:** Abundant whitespace. Sections should have 80px vertical padding.

*Refer to `PRD.md` for full requirements and `apple-DESIGN.md` for complete design tokens.*
