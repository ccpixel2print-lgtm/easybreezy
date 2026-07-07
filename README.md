# Easy Breezy Service Provider — Landing Page

## Project Overview
- **Name**: EASY BREEZY SERVICE PROVIDER
- **Goal**: A modern, premium, mobile-first marketing landing page for an India-based home-services marketplace (Urban Company style).
- **Tagline**: *One App, All Services, Total Peace of Mind*
- **Type**: Marketing landing page only (no working backend, login, cart, or payments — all CTAs are visual placeholders as per scope).

## Tech Stack
- **Framework**: Next.js 14 (App Router, static export `output: 'export'`)
- **Styling**: Tailwind CSS 3 (custom brand theme)
- **Fonts**: Poppins (Google Fonts via `next/font`)
- **Imagery**: AI-generated photorealistic images of Indian home-service professionals (WebP optimized)
- **Deployment target**: Cloudflare Pages (static site)

## Brand Identity
- **Primary (indigo/violet)**: `#3B2C9C` — headings, primary buttons, navbar, key CTAs
- **Accent (yellow)**: `#FFDE17` — highlights, badges, secondary buttons
- **Neutrals**: white `#FFFFFF`, dark grey text `#2A2A2A`, light grey sections `#F5F5F7`
- **Logo**: Circular EB monogram badge (indigo ring + yellow fill), placed in navbar and footer.

## Page Sections (top → bottom)
1. **Sticky Navbar** — Circular EB logo + brand text, nav links (Home, About, Services, Contact), indigo Login button, mobile hamburger menu, smooth-scroll anchors.
2. **Hero** — Headline with yellow accent highlights, pincode-availability widget, hero image, trust stats.
3. **Our Services (B2C, bookable)** — 4 image-led cards: Plumber, Electrician, Maid, Deep Cleaning with "Book Now" buttons.
4. **For Businesses & Societies (B2B, enquiry only)** — 3 cards: Apartment Maintenance, Housekeeping, Security. "Contact Us" buttons smooth-scroll to `#contact`.
5. **Why Choose Us (Trust Bar)** — 4 items with indigo line icons: Trusted Services, On-Time Delivery, Verified Professionals, 24x7 Support.
6. **How It Works** — 4-step timeline with numbered indigo icons.
7. **About** (`#about`) — Brand story + supporting image + highlights.
8. **Contact** (`#contact`) — Contact form (Name, Email, Phone, Message) + business contact details. Landing point for all B2B enquiries.
9. **Footer** — EB logo, quick links, contact info, social icons, copyright.

## Functional Entry URIs
- `/` — Single-page landing page (all sections).
- `/services` — Services catalogue page: header banner, category filter tabs (visual), mapped B2C service grid, and B2B section.
- `/services/[slug]` — Rich service detail pages (statically generated per service: plumber, electrician, maid, deep-cleaning, ac-service, bathroom-cleaning, sofa-cleaning, kitchen-cleaning). Shows a service banner (image, rating, bookings, trust badges) and either a mapped list of bookable sub-service packages (with price, duration, "Add to Cart") OR a directly-bookable flat-price service — driven by a `hasSubServices` flag. Includes a "Why choose Easy Breezy" sidebar, WhatsApp help prompt, and a visual cart-count badge.
- Anchors: `/#home`, `/#about`, `/#services`, `/#contact` (smooth scroll; route back to home from any page).
- Static assets: `/images/*.webp` (hero, service cards, about, logo).

## Data Architecture
- **`src/data/services.ts`** — single source of truth for services (B2C `services[]` + B2B `businessServices[]`). The Services page maps over this array via a reusable `ServiceCard` component, so the grid can later be driven by a database/API with the same shape (fields: `slug`, `name`, `description`, `startingPrice`, `category`, `image`, `imageAlt`).

## Contact Details (live)
- **Address**: BJR Nagar, Jawahar Nagar, Ambedkar Nagar, Hyderabad, Secunderabad, Telangana 500087
- **Email**: easybreezy607@gmail.com
- **Phone**: 90144-34640
- **Google Map**: Embedded in Contact section + "Get Directions" button
- **WhatsApp Support**: Floating button on all pages → wa.me/919014434640 (pre-filled message)

## Features Completed
- ✅ Fully responsive, mobile-first layout
- ✅ Sticky navbar with scroll effect + working mobile hamburger
- ✅ Smooth scrolling for all anchor links
- ✅ Interactive (client-side placeholder) pincode check & contact form
- ✅ B2B "Contact Us" buttons scroll to contact section
- ✅ Fade-in-on-scroll reveal animations + card hover elevations
- ✅ Semantic HTML with single `<h1>` and structured `<h2>/<h3>` hierarchy
- ✅ Optimized WebP imagery for fast loading
- ✅ SEO metadata + accessible markup
- ✅ Google Maps embed + "Get Directions" link in Contact section
- ✅ Global floating WhatsApp support button (#25D366, pulse animation, hover tooltip)
- ✅ Real contact details wired into Contact section & footer (clickable tel/mailto)
- ✅ Dedicated `/services` catalogue page — data-driven grid (mapped from array), 8 services, category filter tabs, "Starting at ₹" pricing, "View & Book" CTAs
- ✅ Reusable `ServiceCard` + `ServicesGrid` + `BusinessServicesSection` components for easy dynamic/API wiring
- ✅ Rich service detail pages at `/services/[slug]` — banner (rating/bookings/trust badges), mapped sub-service package cards, "Add to Cart" buttons, sidebar & WhatsApp prompt
- ✅ Flexible **Option-B model**: `hasSubServices` flag supports both grouped services (package list) and directly-bookable flat-price services (e.g. Bathroom & Kitchen Cleaning)
- ✅ Reusable `SubServiceCard`, `AddToCartButton` (visual) + `CartBadge` item-count indicator

## Not Implemented (out of scope by design)
- Real login / authentication
- Booking, cart, checkout, payments
- Backend API / database
- Pincode availability lookup logic (currently a visual placeholder)
- Contact form submission to a server (shows a client-side confirmation only)

## Recommended Next Steps
- Wire the Login button to an auth flow.
- Connect the pincode widget to a real serviceability API.
- Add a booking flow + backend (e.g. Cloudflare D1 / third-party API).
- Hook the contact form up to an email service (Resend/SendGrid) via a serverless function.
- Add individual service detail pages and customer reviews.

## Local Development
```bash
npm install
npm run build        # static export to ./out
pm2 start ecosystem.config.cjs   # serves ./out on port 3000
# or: npm run dev   (Next dev server)
```

## Deployment
- **Platform**: Cloudflare Pages (static export in `./out`)
- **Status**: ✅ Built & running locally; ready to deploy
- **Last Updated**: 2026-07-02
