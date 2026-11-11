# Launch website validation — 2026-11-11

Scope: marketing repository branch `launch/v0.2.4-marketing`; application source
and database are unchanged.

- `npm test`: 5 passing tests. Covers the five real package URLs, HTTPS-only
  download configuration, unknown-file rejection, successful pre-upload
  verification, corrupted/missing packages, substituted checksums, duplicate
  checksum lines and unexpected checksum entries.
- `npm run build`: static Astro build succeeds for the homepage, downloads,
  getting-started guide, feedback and 404 pages.
- `npm run verify:release -- release-files/v0.2.4`: all five actual downloaded
  GitHub packages match their pinned byte counts and GitHub SHA-256 digests;
  every digest also matches the release's SHA256SUMS.txt. The local release
  files are ignored by Git.
- Chromium browser checks: all four primary routes return 200 on direct load;
  Arabic RTL, English LTR and saved language work; 1440px desktop and 390px
  mobile layouts have no horizontal overflow. Download links point to the
  versioned R2 subdomain, with no macOS links, embedded forms or nested
  anchor/button controls. No page runtime errors were observed.
- Additional Chromium checks: dark-theme persistence, page metadata after
  navigation, zero console errors, visible content without JavaScript and
  no-JavaScript download navigation.
- Desktop and mobile screenshots were captured in ignored `test-results/`.
  Visual review corrected an empty hero illustration on narrow screens and
  made feature copy visible before hydration.
- `git diff --check`: passes.

Browser checks used the host's existing Playwright/Chromium installation against
`npm run preview`; no extra browser dependency is required by the website.

## Unresolved checks

R2 objects have not been uploaded, DNS/Cloudflare Pages have not been configured,
and live public download delivery has not been checked. The proposed
`downloads.legalmasr.com` subdomain needs configuration in the owner's account.
The support email defaults to the app's existing public contact address.

The app release remains beta. Its physical Windows/Linux, tray, cross-device
restore and privacy/legal acceptance gaps remain open as stated in the v0.2.4
release notes. Website checks do not certify those application workflows.
