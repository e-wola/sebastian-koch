# Sebastian Koch — audited HTML website v2

Open `index.html` after extraction or upload this folder to a static host. All seven pages have been corrected and tested with an isolated browser harness.

**Preview mode: all five SEO pages deliberately use `noindex,follow`.** Do not publish or index until Sebastian approves complete business data, legal notices, booking behavior, the portrait and the offer terms. Impressum/Datenschutz are intentionally unfinished drafts. See `PRE-LAUNCH-CHECKLIST.md` and `AUDIT-REPORT.md`.

## Pages
`index.html`, `coaching.html`, `ueber-mich.html`, `erfolge.html`, `kontakt.html`, `impressum.html`, `datenschutz.html`.

## Features
Mobile-first editorial design, five-step coaching finder, calorie/macro estimates, WhatsApp appointment-request form, keyboard-accessible mobile navigation, reduced motion, all-local CSS/JS and optimized user-supplied brand imagery. Booking is an **inquiry**, not a reserved timeslot. No tracking/CDNs are built into this package.

## Static SEO publishing step
After actual legal and content approval and after final HTTPS host is known, run:

```bash
python configure_static_seo.py https://YOUR-REAL-DOMAIN.de --approve-launch
```

This generates canonicals, full Open Graph URLs, `robots.txt` and `sitemap.xml`, and marks the five primary pages indexable. **The script cannot verify that the site is legally ready; approval is your responsibility.** If using a WordPress theme instead, use the *separate* WordPress ZIP, not this HTML ZIP.

## Unresolved
German postal/email legal requirements and actual hosting policy; session duration discrepancy (15 vs 30 minutes in source); commercial VAT/prices; coach identity/photo approval; social profile URLs; actual live booking integration and acceptance testing on hosting.
