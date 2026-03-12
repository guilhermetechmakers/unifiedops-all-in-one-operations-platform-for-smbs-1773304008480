# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# UnifiedOps - Development Blueprint

## Project Concept
UnifiedOps is an all-in-one operations platform for small and medium-sized businesses (SMBs). It consolidates CRM, project management, finance, document management, team messaging, and integrations into a single intuitive interface to reduce tool sprawl, duplicated effort, and operational inefficiency. The vision is a lightweight, approachable SaaS that enables SMBs to manage customers, projects, finances, and internal communications without heavy IT overhead. Core capabilities include dashboard KPIs, invoicing and payments, bank sync, Kanban project boards, document repository and versioning, team messaging, subscription billing, analytics, and an onboarding wizard to get teams productive quickly.

AI app description: N/A (project uses integrations and automation but is not an AI-first product). The app will provide automation hooks (webhooks, scheduled jobs) and support integration with external APIs (Stripe, Plaid, SendGrid, Twilio, OAuth providers, QuickBooks).

## Problem Statement
- Core problems:
  - SMBs use multiple disconnected tools (CRM, PM, accounting, messaging), causing fragmented workflows and duplicated data entry.
  - Lack of integrated reporting across operations (sales, projects, cashflow) hinders timely decisions.
  - SMBs face complexity and cost from enterprise-grade tools; need simpler, cost-effective solution that fits SME processes.
  - Onboarding & IT support overhead is a barrier for non-technical small businesses.
- Who experiences these problems:
  - Small business owners, operations managers, accountants/bookkeepers for SMBs, and small teams across services, retail, agencies, and professional services.
- Why these problems matter:
  - Wasted time, lost revenue, invoicing errors, delayed payments, missed deadlines, and poor team coordination reduce competitiveness and growth.
- Current state/gaps:
  - No single lightweight platform tailored to SMB operations combining CRM, invoicing, project management, messaging and banking reconciliation with simple UX and affordable pricing.

## Solution
UnifiedOps addresses these problems by delivering an integrated SaaS platform that centralizes customer data, projects, finance, documents, and team communication with SMB-friendly workflows and pricing. Approach:
- Build modular product areas (CRM, Projects, Finance, Docs, Messaging) with consistent UI and cross-linking between entities (contacts ↔ invoices ↔ projects).
- Provide fast onboarding wizard with templates and connectors (Stripe, Plaid) to reduce setup friction.
- Support secure payments, recurring invoicing, bank sync and reconciliation to improve cashflow.
- Offer admin and subscription management for seat-based plans and easy upgrades/downgrades.
Key differentiators:
- Purpose-built simplicity for SMBs with pre-configured templates and an approachable UX.
- Tight integration across modules (e.g., create invoice from project milestone).
Value creation:
- Time savings, fewer errors, faster payments, consolidated reporting for better decisions, lower tool costs.

## Requirements

### 1. Pages (UI Screens)
- Landing Page (Public)
  - Purpose: Marketing and acquisition; convert visitors to trial/demo.
  - Key sections: Hero (headline, CTAs), Feature Overview cards (CRM, Projects, Finance, Docs, Messaging, Integrations), How It Works (3-step), Pricing Teaser, Customer Logos & Testimonials carousel, Header/Footer.
  - Contribution: Drives signups and summarizes value.
- Privacy Policy
  - Purpose: Legal disclosure of data practices.
  - Key sections: Sectioned policy text, anchor navigation, Download PDF, contact link.
  - Contribution: Compliance and user trust.
- Terms of Service
  - Purpose: Legal terms for platform use and billing.
  - Key sections: Sectioned terms, anchor nav, version & updated timestamp, legal contact.
  - Contribution: Risk mitigation and contractual clarity.
- Cookie Policy
  - Purpose: Cookie consent and controls.
  - Key sections: cookie categories, accept/reject toggles, link to privacy policy.
  - Contribution: Compliance with privacy regulations.
- About & Help
  - Purpose: Company info, mission, FAQ and support links.
  - Key sections: Company story, FAQ accordion, support contact form, knowledge base links.
  - Contribution: Support and trust building.
- 404 Not Found
  - Purpose: Friendly fallback for undefined routes.
  - Key sections: Illustration, quick links (Dashboard/Login/Landing/Help), search box.
  - Contribution: Better UX for broken links.
- 500 Server Error
  - Purpose: Error recovery UX and reporting.
  - Key sections: Error message, retry button, support contact, error code.
  - Contribution: Better troubleshooting and user guidance.
- Loading & Success States (Reusable)
  - Purpose: Communicate action progress and completion.
  - Key sections: Spinner, contextual messages, success CTA, error fallback.
  - Contribution: Clear operation feedback.
- Login / Signup
  - Purpose: Authentication entry point and user creation.
  - Key sections: Tabbed Login/Signup, OAuth buttons, SSO placeholders, remember me, forgot password, social logins.
  - Contribution: Secure onboarding and low-friction access.
- Password Reset
  - Purpose: Secure password recovery.
  - Key sections: Request form (email), reset form (token + new password), success confirmation.
  - Contribution: Account recovery security.
- Email Verification
  - Purpose: Confirm and validate email invites/signup.
  - Key sections: Verification status, resend button, support link.
  - Contribution: Account security and deliverability.
- Onboarding Wizard
  - Purpose: Guided initial configuration for new orgs.
  - Key sections: Progress bar, company profile, team invites, connect Stripe/Plaid, template selection, skip/finish.
  - Contribution: Faster time-to-value.
- Dashboard
  - Purpose: Primary workspace and executive summary.
  - Key sections: KPI cards, activity feed, cashflow snapshot, quick actions, widgets, date-range selector, notifications dropdown.
  - Contribution: Central command center for operations.
- CRM - Contacts List
  - Purpose: Manage customers and leads.
  - Key sections: Search/filters/tags, contact table/cards, bulk actions, import/export.
  - Contribution: Customer management and outreach.
- CRM - Contact Detail
  - Purpose: Single contact 360° view.
  - Key sections: Header summary, activity timeline, deals, projects, invoices, files, notes, quick add.
  - Contribution: Unified customer context.
- Create Customer
  - Purpose: Add new customer/lead.
  - Key sections: Multi-field form, custom field builder, CSV import mapping, Save & Create Project CTA.
  - Contribution: Accurate customer data capture.
- Projects - Board (Kanban)
  - Purpose: Visual task/project management.
  - Key sections: Columns (stages), drag-and-drop, quick add, filters, task quick actions.
  - Contribution: Delivery management and team coordination.
- Project Detail
  - Purpose: Project execution workspace.
  - Key sections: Header (status, due, budget), milestones/Gantt-lite, tasks, attachments, activity, budget snapshot.
  - Contribution: Project tracking and billing linkage.
- Create Project
  - Purpose: Start new projects using templates.
  - Key sections: Template selector, billing mode, default tasks, assignees, auto invoice toggles.
  - Contribution: Fast project creation aligned to billing.
- Finance Overview
  - Purpose: Company financial snapshot.
  - Key sections: Cashflow chart, receivables aging, outstanding invoices, bank sync status, quick create invoice.
  - Contribution: Financial visibility and actions.
- Create Invoice
  - Purpose: Compose and send invoices.
  - Key sections: Line-items editor, taxes/discounts, templates, PDF preview, Save/Send/Collect, attachments, payment terms.
  - Contribution: Revenue collection.
- Invoice Detail
  - Purpose: Manage and view invoice lifecycle.
  - Key sections: Status badge, amount due, payment history, reminders/refunds/manual payment, PDF download.
  - Contribution: Collections and audit trail.
- Checkout / Payment
  - Purpose: Secure payment UX for invoices/subscriptions.
  - Key sections: Stripe Elements secure input, saved methods, guest payment, promo code, summary, states.
  - Contribution: Payment collection and conversions.
- Transactions / Order History
  - Purpose: View payments, refunds, payouts.
  - Key sections: Filterable table, detail modal with webhook logs, CSV export.
  - Contribution: Reconciliation and accounting.
- Subscription Management
  - Purpose: Manage org billing plan and seats.
  - Key sections: Plan summary, change plan/proration preview, billing contact, payment method, billing history.
  - Contribution: Monetization and self-serve billing.
- Documents
  - Purpose: Repository for contracts, proposals and files.
  - Key sections: Folder tree, file list, upload area, versioning, share links, permissions.
  - Contribution: Centralized document access and collaboration.
- Document Viewer
  - Purpose: Full-screen document consumption and annotation.
  - Key sections: PDF viewer, comments thread, redaction notes, download/version history.
  - Contribution: Collaboration and auditability.
- Team Messaging - Inbox
  - Purpose: Team communication hub.
  - Key sections: Thread list, unread counts, compose with mentions/attachments, search.
  - Contribution: Real-time coordination and context preservation.
- Team Messaging - Thread
  - Purpose: Conversation view for thread interactions.
  - Key sections: Message stream, composer, attachments, thread settings (mute/pin).
  - Contribution: Deep conversation context and actions.
- Settings & Preferences
  - Purpose: Account and app configuration.
  - Key sections: Profile, security/2FA, company branding, templates, integrations, notifications, data export.
  - Contribution: Admin control and personalization.
- User Profile
  - Purpose: Personal info and preferences.
  - Key sections: Avatar, role/permissions, activity log, notification prefs, timezone.
  - Contribution: Identity and personalization.
- Admin Dashboard
  - Purpose: Org-level administration and oversight.
  - Key sections: Usage metrics, seat count, security events, pending invites, system alerts.
  - Contribution: Governance and billing management.
- User Management
  - Purpose: Provision users and manage roles.
  - Key sections: User table, invite flow, role assignment, deactivate/reactivate, audit trail.
  - Contribution: Access control and audit.
- Analytics & Reports
  - Purpose: Pre-built and custom reporting.
  - Key sections: Report cards, report builder, export/schedule, permissioned sharing.
  - Contribution: Data-driven decision making.

### 2. Features
- User Authentication
  - Tech: bcrypt/Argon2 password hashing, JWT access + refresh tokens or secure server sessions; rate-limiting and brute-force protection; OAuth2 (Google, Microsoft); SAML/SSO placeholders; audit logging.
  - Implementation notes: Short token lifetime, refresh token rotation, secure cookie flags, device/session listing in settings.
- Password Management
  - Tech: Reset tokens single-use with expiry, complexity checks (server + client), history checks.
  - Notes: Enforce throttling for reset requests.
- Two-Factor Authentication (2FA)
  - Tech: TOTP RFC6238, Twilio SMS with rate-limits, backup codes, admin override flows.
  - Notes: UX to set up authenticator and backup codes; allow recovery via admin with audit trail.
- Dashboard & Widgets
  - Tech: Server-side aggregated KPI endpoints, Redis caching for hot reads, widgets persisted per user, realtime via WebSockets/SSE.
  - Notes: Lazy-load heavy widgets; provide widget configuration API.
- Finance & Accounting
  - Tech: Invoice/payment models, double-entry compatibility for reporting, Plaid bank sync, currency and tax handling, audit logs.
  - Notes: Reconciliation workflows with manual match, idempotent operations for payments.
- CRM
  - Tech: Relational schema for contacts/deals, full-text search or ElasticSearch, bulk import/queue processing, dedup heuristics.
  - Notes: Import preview mapping, merge UI with conflict resolution.
- Project Management
  - Tech: Task/project models, drag-and-drop with server-side ordering, lightweight time-tracking aggregation.
  - Notes: Keyboard accessibility for board; server checks to prevent lost updates.
- Invoicing
  - Tech: Template engine for HTML->PDF, server-side PDF generation (wkhtmltopdf / Puppeteer), recurring invoice scheduler, email templates.
  - Notes: Background job queue (e.g., Sidekiq/Bull) for scheduled tasks.
- Payments Processing
  - Tech: Stripe Payment Intents, webhook handlers, idempotency keys, saved payment method vaulting.
  - Notes: PCI scope minimized by using Stripe Elements; robust webhook retry and verification.
- Document Management
  - Tech: S3 pre-signed uploads, version records in DB, ACLs and expiring share links, virus scan hook integration.
  - Notes: Enforce file-type and size validations.
- Team Messaging & Notifications
  - Tech: WebSockets + fallback polling, message persistence, search indexing, email/SMS integration (SendGrid/Twilio), notification preferences.
  - Notes: Digest automation, unread counts and push notifications for web.
- Search & Filters
  - Tech: Central search index (ElasticSearch), faceted filters, autocomplete with caching.
  - Notes: Provide saved searches per user; privacy controls for indexed content.
- File Upload & Management
  - Tech: Chunked uploads, client-side previews, pre-signed URLs, server-side virus scan, upload retries.
  - Notes: Progress feedback and resumable uploads.
- Data Import / Export
  - Tech: CSV/XLS mapping UI, queued processing for large imports, row-level validation reports, export endpoints for CSV/PDF.
  - Notes: Admin notifications when imports complete/fail.
- Notifications (In-app, Email, SMS)
  - Tech: Internal notification store, SendGrid for emails, Twilio for SMS, retry & dead-letter handling.
  - Notes: Preference UI to mute channels and set digest times.
- Reporting & Analytics
  - Tech: ETL-like aggregation pipeline, caching, report scheduler, exports.
  - Notes: Permissioned sharing and scheduled delivery via email.
- Admin Tools & Audit
  - Tech: RBAC with permission matrix, audit logging with retention policy, feature flag system.
  - Notes: Expose audit logs with filters and export.
- Subscription & Billing Management
  - Tech: Stripe Billing for plans, proration handling, seat metering, billing webhooks and reconciliation.
  - Notes: Self-serve upgrade/downgrade UI with proration preview.
- Caching & Backup Strategy
  - Tech: Redis for caching, nightly DB snapshots, incremental object storage backups, restore runbooks.
  - Notes: S3 lifecycle for older objects, test restores periodically.
- SEO & Performance Optimization
  - Tech: SSR for public pages, metadata, sitemap, Lighthouse monitoring.
  - Notes: CDN for static assets, code-splitting, performance budgets.

### 3. User Journeys
- New SMB Owner (Trial Start)
  1. Landing Page → Start Free Trial CTA.
  2. Signup (email/password or Google OAuth) → Email verification.
  3. Onboarding Wizard: company info → invite teammates → connect Stripe (optional) → choose templates → finish.
  4. Redirect to Dashboard with starter widgets and guided checklist.
  5. Create Customer → Create Project or Invoice from customer.
  6. Send invoice → customer receives email with payment link → payment via Checkout → ledger updated.
- Admin via Invitation or SSO
  1. Receive invite link → open → Signup or SSO → verify email.
  2. Accepted invite → assigned role → redirected to Admin Dashboard or Onboarding step based on org state.
  3. Manage users (invite, role assignment), access billing and seat provisioning.
- Accountant / Finance User
  1. Login → Navigate to Finance Overview → connect Plaid for bank sync.
  2. Review receivables aging → select outstanding invoice → send reminder.
  3. Record payment or reconcile bank transaction with invoice → export transactions CSV for QuickBooks sync.
- Project Manager
  1. Login → Projects Board → create project from template → assign tasks.
  2. Use Kanban to move tasks, log time entries → milestone completed triggers invoice creation (if auto-create enabled).
  3. Use Project Detail for attachments and team messaging thread.
- Customer Guest Payment Flow
  1. Customer receives invoice email with tokenized link → opens Checkout page (guest view).
  2. Fills payment details (Stripe Elements) → payment success → show success screen and receipt.
  3. Org ledger updated; notifications to invoice creator.
- Support / Help Flow
  1. User accesses Help page or in-app help → search KB or open support contact form → create ticket/email to support.
  2. Admin or support responds; user receives in-app notification and email.
- Password Reset & 2FA Recovery
  1. User clicks Forgot Password → enters email → receives reset link (single-use token) → sets new password.
  2. If 2FA enabled and lost authenticator, user follows recovery flow using backup codes or requests admin override with audit trail.

## UI Guide
---

## Visual Style

### Color Palette:
- Primary background: very light cool gray for page canvas — #F6F7F8 (used for whole-page background to create soft contrast with white cards).
- Card/background surfaces: pure white — #FFFFFF (used for hero card panels, feature cards and content surfaces).
- Primary text (headlines/body): deep charcoal for high contrast — #111827 (used for H1/H2 and major CTAs).
- Secondary text and UI copy: muted medium gray — #6B7280 (used for descriptions, captions and supporting copy).
- Subtle borders / dividers: soft cool gray stroke — #E6E8EB (used for card outlines, separators and subtle grid lines).
- Accent / highlight (brand/CTA accent, “Organiser” text and chart accents): teal-mint — #2DD4BF (used for highlighted words, active chart bars, small status chips).
- Secondary accent (supporting chart / subtle highlights): verdant green — #10B981 (used sparingly in visualizations and success states).
- Strong CTA / dark pill: near-black charcoal for primary CTA buttons — #0B1220 or #111827 (white text on dark pill).
- Muted logo/partner greys: desaturated gray — #BFC6CD (used for partner logos and low-contrast elements).
- Shadow color: cool shadow tint — rgba(17,24,39,0.06) for subtle elevation.

### Typography & Layout:
- Font families: modern geometric/neo-grotesque sans (Inter, Poppins or similar). Use a crisp display face for larger headings and the same family for body to maintain coherence.
- Hierarchy:
  - H1: bold/extra-bold, 48–56px, tight line-height (1.05–1.15), color #111827 — heavy visual anchor in hero.
  - H2 / Section headings: 20–28px, semi-bold (600), color #111827.
  - Body / paragraphs: 15–18px, regular (400), color #6B7280, comfortable 1.5 line-height for readability.
  - Micro / captions: 12–14px, medium to regular, color #9CA3AF or #6B7280.
  - Buttons: 14–16px, semi-bold (600) for primary CTAs; medium (500) for secondary/ghost.
- Spacing & rhythm:
  - Generous white space — large vertical rhythm (32–48px between major sections); hero has especially large top/bottom padding to center content.
  - Container width: centered max-width ~1100–1200px with roomy side padding; content often centered horizontally.
  - Grid patterns: modular grid with 3-column row for feature cards in hero; two-column split used for content blocks below; consistent gutters ~24–32px.
- Alignment: predominantly center-aligned in the hero area (headline & three cards centered), left alignment for explanatory sections and content lists for readability.
- Typography treatments: occasional single-word color highlight (teal #2DD4BF) and pill-style tag for emphasis; strong visual contrast between bold display headline and subdued body copy.

### Key Design Elements
#### Card Design:
- Card styling: white surface cards with large rounded corners (12–18px radius), subtle soft drop shadow (rgba(17,24,39,0.06) 0px 8px 24px) and a faint border/stroke (#E6E8EB) to define edges on the light background.
- Hover states: slight lift (translateY(-3px)) and slightly intensified shadow plus subtle border color shift to a cooler tint.
- Visual hierarchy within cards: small icon or mini-screenshot at top, concise bold step title, supporting copy in muted gray; micro-CTA or pill badge (teal) used for action emphasis. Cards are compact, with consistent inner padding (~20–28px) and centered content in hero row.

#### Navigation:
- Top nav pattern: minimal horizontal bar with left-aligned logo and right-aligned nav links; a prominent pill CTA (dark) separated from link group.
- Sidebar: not present in hero; the design favors a top navigation and center content flow rather than heavy sidebars.
- Active states: active/primary nav items indicated by subtle underline or bold weight; CTA shown as filled pill (dark background, white label) to clearly contrast with ghost links.
- Collapsible elements: minimal use in landing context; any expandables should follow the same rounded, soft-shadow card language with clear chevron indicators.

#### Data Visualization:
- Chart style: clean, minimalist charts with rounded bar ends (high border-radius), pastel/teal accent fills (#2DD4BF / #10B981) and light gray gridlines (#E6E8EB).
- Visual treatments: no heavy embellishment — flat fills with subtle drop shadows for emphasis; axes and labels are small, muted gray (#9CA3AF) so charts read as part of the UI rather than decorative.
- Patterns: stacked or grouped small multiples inside card-like containers; emphasis on clarity (single accent color per dataset) and micro-interactions (hover reveals tooltips).
- Backgrounds: chart panes sit on white cards with soft inner padding and minimal axis lines; dotted or dashed guide lines in very light gray for scale.

#### Interactive Elements:
- Buttons:
  - Primary: dark pill (full fill #111827), white text, rounded-full radius, semi-bold typography, medium padding (12–14px vertical).
  - Secondary: ghost/outlined (border #E6E8EB or #111827), white background or transparent, rounded, subtle inner shadow when hovered.
  - Accent action: small mint/teal pill (#2DD4BF) for inline actions or tags.
- Form elements: large, airy input fields with 10–12px corner radius, thin border #E6E8EB, padding 12–14px, muted placeholder text (#B0B7BD). Focus state uses a soft ring in a translucent accent (rgba(45,212,191,0.14)) and increased border contrast.
- Hover & micro-interactions: subtle lift and shadow on cards/buttons; slight scale (1.02) on primary CTA on hover; tooltips and toasts use the accent mint background with white text or dark text depending on contrast.
- Avatars & badges: circular avatars with thin border or shadow; small status badges use bright accent with white text and pill radius.

### Design Philosophy
This interface embodies:
- Modern, minimalist SaaS aesthetic: clean, airy layouts with a restrained color palette and strong typographic hierarchy to convey clarity and trust.
- Professional yet friendly: teal-mint accents inject an approachable, optimistic tone while dark charcoal text and ample white space maintain seriousness and legibility for SMB users.
- Clarity-first visual strategy: every surface emphasizes readability and function — headlines punchy and bold, descriptive copy subdued, charts simple and directly interpretable.
- Component consistency and accessibility: rounded, touch-friendly controls, high contrast primary CTAs, and subtle focus states prioritize usability across devices.
- Micro-interaction strategy: lightweight, unobtrusive motion (small lifts, gentle transitions) provides tactile feedback without distracting from core tasks — designed to make operations feel organized, calm and efficient.

**Implementation Notes:**
Apply the design system above consistently throughout the application. Ensure all components, pages, and features adhere to the specified color palette, typography, spacing, and visual style guidelines.

## Instructions to AI Development Tool
This blueprint provides the complete context needed to build this application. When implementing any part of this project:
1. Refer back to the Project Concept, Problem Statement, and Solution sections to understand the "why" behind each requirement
2. Ensure all features and pages align with solving the identified problems
3. Verify all features and pages are built according to specifications before completing the project
4. Pay special attention to the UI Guide section and ensure all visual elements follow the design system exactly
5. Maintain consistency with the overall solution approach throughout implementation

PROJECT CONTEXT:
PROJECT: UnifiedOps - All-in-One Operations Platform for SMBs

(Refer to sections above for detailed scope, pages, features, integrations, assets, and user flows.)

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
