# Sky's The Limit Travels — Website

> Your Journey. No Limits. Just Memories.

A vibrant, fully responsive landing page for **Sky's The Limit Travels**, built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no external image dependencies. All artwork (hero splash composition, destination scenes, icons, logo) is hand-crafted inline SVG, so the site is fast and self-contained.

## Sections

1. **Header / Navigation** — sticky glass header, gradient logo, full menu, Book Now CTA, mobile hamburger menu
2. **Hero** — "Your Journey. NO LIMITS. JUST MEMORIES." with animated splash-art brand composition
3. **Feature Bar** — Expert Travel Planning · Best Price Guarantee · 24/7 Support · VIP Experiences
4. **Booking Search** — Flights / Hotels / Packages / Cruises tabs with From, To, Depart, Return, Travelers fields
5. **Popular Destinations** — Bali, Paris, Dubai, Cancun cards with custom SVG scenes and pricing
6. **Why Travel With Us** — airplane-window scene, "We Turn Dreams Into Destinations" badge, benefits checklist
7. **CTA Banner** — "Ready to Take Off? Let's Plan Your Next Adventure!"
8. **Footer** — quick links, travel services, contact info, newsletter signup, social links

## Running locally

It's a static site — open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Using the real hero artwork

The hero's right-side graphic prefers a real image when one exists: drop the original
"Sky's The Limit Travels" 3D splash artwork into the repo as **`assets/hero-art.png`**
(no code changes needed — the page automatically shows it, and falls back to the inline
SVG recreation when the file is absent). A transparent-background PNG around
1024×934 works best.

## Tech notes

- **Fonts:** Montserrat (headings/body) + Dancing Script (script accents) via Google Fonts
- **Responsive:** breakpoints at 1120px, 900px, and 560px; mobile nav drawer
- **Motion:** scroll-reveal animations, floating hero art, drifting clouds — all disabled under `prefers-reduced-motion`
- **Interactions:** booking tabs, origin/destination swap, date pickers, toast notifications, back-to-top, scroll-spy nav
- **Accessibility:** semantic landmarks, ARIA tabs/labels, keyboard focus styles, `aria-live` toast
