# Scale Forge — Performance Fix Checklist

## Step 1 — Image Optimization with Next.js `<Image>`
> Expected gain: **+25–35 pts** (Mobile & Desktop)

- [x] `components/ProjectsSection.tsx` — Already uses `<Image fill />` ✅
- [x] `components/TeamSection.tsx` — Already uses `<Image fill />` ✅
- [ ] `public/og-image.png` (987 KB) — Compress to <100 KB WebP
- [ ] `public/twitter-card.png` (969 KB) — Compress to <100 KB WebP
- [ ] `public/Assets/Blogs_2.png` (4.9 MB!) — Compress or replace
- [ ] `public/Assets/F1.jpg` (2.9 MB!) — Compress heavily
- [ ] `public/Assets/Shahood.png` (1.8 MB) — Compress
- [ ] `public/Assets/Ruhan.png` / `Ruhan_Bk.png` (946 KB each) — Compress
- [x] Add `priority` attribute to above-the-fold images in `TeamSection`

> **Note:** Hero uses a `<video>` tag — no `<img>` tags to replace there. All project images already use Next.js `<Image>`.

---

## Step 2 — Fix Render-Blocking CSS
> Expected gain: **+10–15 pts**

- [x] `globals.css` is only imported in `app/layout.tsx` ✅
- [ ] `components/InitialLoader.css` — imported inside `InitialLoader.tsx` component file (not `_app`/`layout`), triggers render-blocking. Wrap with `dynamic()` + `ssr: false`
- [ ] `components/PremiumButton.css` — imported in `PremiumButton.tsx`. Move styles inline or to CSS module

---

## Step 3 — Fix Legacy JavaScript
> Expected gain: **+5–10 pts**

- [x] `.browserslistrc` already exists with correct modern targets ✅
- [ ] Add `experimental: { legacyBrowsers: false }` to `next.config.mjs`
- [ ] Remove any old polyfill imports (none found — ✅)

---

## Step 4 — Fix JavaScript Errors
> Expected gain: **+5–8 pts**

- [ ] Wrap third-party scripts (Clarity, GA) in try/catch or verify they load without console errors
- [ ] Check for hydration mismatches — `Hero.tsx` has a `mounted` guard ✅
- [ ] Ensure `next/script` with `strategy='afterInteractive'` is used (already done in `layout.tsx`) ✅

---

## Step 5 — Enable / Verify HTTP/2
- [ ] Test at `https://tools.keycdn.com/http2-test`
- [ ] Vercel enables HTTP/2 by default — verify `vercel.json` headers aren't disabling it

---

## Step 6 — Remove Inline CSS
- [ ] `HomePricingSection.tsx` — has `<style>` JSX block with `.blob-card`, `.blob-bg`, `.blob-element` — move to CSS module
- [ ] Audit all `style={{ }}` prop usages across components

---

## Step 7 — Reduce DOM Size
- [ ] Review Framer Motion wrapper divs in `Hero`, `HowWeWorkSection`, `FeaturesAccordion`
- [ ] Consider replacing simple fade animations with CSS transitions where possible

---

## Step 8 — Shorten Title Tag ✅
- [x] `app/layout.tsx` — Title is already `'Scale Forge — Web Design & SEO Agency'` (38 chars) ✅

---

## Step 9 — Add Content to Reach 900+ Words
- [ ] `HowWeWorkSection.tsx` — Expand step descriptions to ~50 words each
- [ ] `HomePricingSection.tsx` — Pricing descriptions are already long ✅
- [ ] `TestimonialsSection.tsx` — Expand each testimonial to ~80 words
- [ ] `FAQSection.tsx` — FAQ answers are already 2–3 sentences ✅

---

## Step 10 — Security: SPF & DMARC DNS Records
> These are DNS-level changes, not code changes

- [ ] Add SPF TXT record: `v=spf1 include:_spf.google.com ~all`
- [ ] Add DMARC TXT record: `v=DMARC1; p=quarantine; rua=mailto:admin@scaleforge.com`
- [ ] **Action:** Login to your DNS provider and add the two TXT records

---

## Step 11 — Social & Tracking
- [ ] Create Facebook Page → get URL → add to footer social links in `ContactSection.tsx`
- [ ] Install Facebook Pixel (get ID from Meta Ads Manager) → add to `layout.tsx`
- [ ] Create YouTube channel → add to footer
- [ ] Email obfuscation in `ContactSection.tsx` — currently partially obfuscated (split string concat) — improve further

---

## Summary of Code Changes Required

| File | Change |
|------|--------|
| `next.config.mjs` | Add `legacyBrowsers: false` |
| `components/InitialLoader.tsx` | Use `dynamic()` with `ssr: false` in parent |
| `components/HomePricingSection.tsx` | Move inline `<style>` to CSS module |
| `components/TestimonialsSection.tsx` | Expand testimonial text |
| `components/TeamSection.tsx` | Add `priority` prop to images |
| `app/page.tsx` | Wrap `InitialLoader` dynamically |
| DNS Provider | Add SPF + DMARC TXT records |
