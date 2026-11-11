# Legal Masr launch website

Arabic-first Astro/React marketing site for **Legal Masr v0.2.4 public beta**.
Production: https://legalmasr.com. Installer host: https://downloads.legalmasr.com.

```bash
npm ci
npm test
npm run build
npm run preview
```

Use Node 22.21.1 (see `.node-version`). Deploy the generated **dist** directory to
Cloudflare Pages. No server adapter, R2 binding or database is needed by the site.
Old compiled snapshots are excluded from version control.

`src/release.json` pins the actual release filenames, byte counts and GitHub
SHA-256 digests. `PUBLIC_DOWNLOAD_BASE_URL` can override the R2 version prefix;
`PUBLIC_SUPPORT_URL` can override the support email already used in the app.
Both are public build-time settings; see `.env.example`.

Read [the launch plan](docs/launch.md) before deployment. It includes R2 upload,
checksum verification, Pages settings and outstanding release acceptance.

The current URL structure defaults to Arabic, with an English language switch.
Separate English URLs and reciprocal hreflang tags are future work. The React
application hydrates for navigation and preferences; static HTML contains the
Arabic page copy and download links.
