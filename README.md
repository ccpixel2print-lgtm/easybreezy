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
- Anchors: `#home`, `#about`, `#services`, `#contact` (smooth scroll).
- Static assets: `/images/*.webp` (hero, service cards, about, logo).

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
