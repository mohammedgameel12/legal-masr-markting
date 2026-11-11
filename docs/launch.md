# v0.2.4 launch scope and acceptance

## Scope

Prepare the existing marketing site for the first **public beta**, using the
actual Windows/Linux v0.2.4 artifacts. Website: `legalmasr.com` (owner supplied).
Download subdomain: `downloads.legalmasr.com` (proposed configuration).
The application repository and application data remain unchanged.

Acceptance for this preparation: bilingual copy matches implemented workflows;
no research-notebook, transcription, promised SaaS date or macOS download claims;
all five packages use exact release names and sizes; checksums can be verified;
Pages builds from source; RTL, mobile layout and navigation are checked.
Live hosting and physical application acceptance are separate gates below.

Sources of truth:

- [v0.2.4 release](https://github.com/Mahmoud-s-Khedr/legal-masr/releases/tag/v0.2.4)
- App repository: `docs/plan.md`, `docs/copy-guide.md`,
  `docs/plan/01-product-requirements.md`, `docs/plan/04-functional-modules.md`,
  `docs/plan/06-privacy.md`, `docs/plan/07-backup-format.md`,
  `docs/plan/08-release-process.md`, `docs/launch-checklist.md`.

## R2: publish exact release bytes first

1. Create a dedicated R2 bucket for **public installers only**. Do not put backups,
   client records or support files in it.
2. Add `downloads.legalmasr.com` under bucket Settings → Custom Domains. The zone
   must be in the same Cloudflare account. Wait for the domain to become Active.
   Use the custom domain for production; `r2.dev` is for development.
3. Download the existing release; do not rebuild or rename its packages:

   ```bash
   mkdir -p release-files/v0.2.4
   gh release download v0.2.4 --repo Mahmoud-s-Khedr/legal-masr --dir release-files/v0.2.4
   npm run verify:release -- release-files/v0.2.4
   ```

4. In the R2 dashboard upload the five verified packages and `SHA256SUMS.txt`
   under the object prefix `releases/v0.2.4/`. Preserve exact, case-sensitive
   filenames from `src/release.json`. Keep this prefix immutable. Any corrected
   package must use a new release version and a fresh prefix.
5. Set package HTTP metadata `Content-Type` appropriately (`application/octet-stream`
   is suitable for installer downloads; `application/zip` for ZIP and `text/plain`
   for checksums). Set `Content-Disposition: attachment; filename="<exact filename>"`
   for downloads. Versioned immutable objects may use
   `Cache-Control: public, max-age=31536000, immutable` after integrity review.
6. Download **all six objects back through the public custom domain** into a
   separate folder and run the same verifier on that folder. This checks public
   delivery as well as upload integrity. Confirm response status, download
   filenames, lengths and MIME types. No browser CORS policy is required for
   normal direct download links; the site does not fetch the packages with JS.

Expected public checksum URL:
`https://downloads.legalmasr.com/releases/v0.2.4/SHA256SUMS.txt`.
The five package URLs share that prefix and the filenames in `src/release.json`.

## Pages: build and connect the domain

Connect `Mahmoud-s-Khedr/legal-masr-markting` with Cloudflare Pages Git integration.
Use production branch `main`, root directory `/`, build command `npm run build`,
output directory `dist`, and `NODE_VERSION=22.21.1`.

Public build-time settings:

```text
PUBLIC_DOWNLOAD_BASE_URL=https://downloads.legalmasr.com/releases/v0.2.4
PUBLIC_SUPPORT_URL=mailto:Mahmoud.s.khedr.2@gmail.com
```

The support address matches the app's existing developer-contact destination.
No Cloudflare token or R2 write credential belongs in any `PUBLIC_` variable.
Add `legalmasr.com` using Pages → Custom domains and follow the DNS instructions.
Do not add a catch-all SPA redirect: Astro already generates the individual pages
and a 404 page. Preview deployments should be marked noindex using Pages settings
or preview-specific headers. Canonical URLs are set to the production domain.

Deploy only after public R2 verification. Preview the branch, verify the content,
then merge it to the production branch when ready. Test direct loads, refreshes,
language switching, light/dark themes, mobile widths and every download link.

## Copy and privacy boundaries

Lead: **مكتبك القانوني على جهازك** / **Your law office, on your computer**.
Audience: individual Egyptian lawyers using one computer. Free, no subscription,
no mandatory account, Arabic-first, core work offline. Highlight cases, hearings,
clients, powers of attorney, fees/expenses, managed documents and manual backups.

Keep the public download flow simple: choose a package, download and install.
Do not ask end users to check SHA hashes or checksums. Release integrity
verification belongs to the maintainer publishing workflow only. The former
pre-release acceptance and checksum callouts are removed from the download page.

The site discloses unsigned packages, manual updates and unencrypted exports.
It does not claim completed physical-platform or cross-device restore acceptance.
The support page explains browser preferences, hosting connection metadata and
that the app does not automatically submit reports. No embedded Google Form,
analytics or telemetry is added. This factual copy is not an approved legal
privacy notice or terms of use.

## Gates before broader production use

- Record physical Windows/Linux install, update, removal and tray results.
- Complete cross-device restore acceptance with the actual release packages.
- Complete the owner's Egyptian privacy/legal review and approve a privacy
  notice and terms; do not represent the support copy as that approval.
- Confirm the support address and the proposed download subdomain.
- Verify R2 public delivery and the Pages custom domain after configuration.
- Begin beta evaluation with fictional records and a separate backup.

## Validation record

See `validation.md` for the checks completed in this checkout. Hosting changes,
R2 upload, DNS changes and repository publication are not implied by local build
success. Never advertise v0.2.4 as a stable release while its release notes label
it beta and list acceptance gaps.

## Official hosting references

- [Cloudflare Pages: Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Cloudflare R2: public buckets and custom domains](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [shadcn Base UI buttons: use semantic links with buttonVariants](https://ui.shadcn.com/docs/components/base/button#as-link)
