# Shine Republic Car Wash & Valet — demo website

A bold, mobile-first demo website for a **fictional** independent car wash, valet and detailing business in Bardene, Boksburg (Gauteng).
Built as a sales demo by Conrad Joubert. All business details (address, phone, email, WhatsApp number, reviews) are placeholders.

- Pure HTML / CSS / vanilla JavaScript — no build step, no frameworks.
- All paths are **relative**, so it works at a domain root *and* under a GitHub Pages project subpath (`https://<user>.github.io/<repo>/`).
- Packaged as a Visual Studio solution with a tiny ASP.NET Core host so you can press **F5** to preview it.

## Folder layout

```
carwash/
├─ ShineRepublic.sln                  ← open this in Visual Studio
├─ ShineRepublic.Web/
│  ├─ ShineRepublic.Web.csproj        ← ASP.NET Core empty project (net10.0)
│  ├─ Program.cs                      ← UseDefaultFiles + UseStaticFiles only
│  ├─ Properties/launchSettings.json
│  └─ wwwroot/                        ← THE WEBSITE (this is what gets published)
│     ├─ index.html, 404.html, .nojekyll
│     ├─ css/styles.css, js/main.js
│     ├─ assets/logo.svg, assets/logo-light.svg, assets/img/*.webp
│     └─ favicon.svg/.png/.ico, apple-touch-icon.png, icon-512.png, site.webmanifest
└─ .github/workflows/deploy-pages.yml  ← auto-deploys wwwroot to GitHub Pages on push to master
```

## Open and run in Visual Studio (2022 or 2026)

1. Requires the **.NET 10 SDK** (included with Visual Studio 2026 / VS 18 with the *ASP.NET and web development* workload).
2. Double-click `ShineRepublic.sln`.
3. Press **F5** (or Ctrl+F5). The site opens in your browser at `http://localhost:5057` (or `https://localhost:7289` with the *https* profile).

> Only have the .NET 9 SDK? Change `<TargetFramework>net10.0</TargetFramework>` to `net9.0` in `ShineRepublic.Web.csproj`.

Command line alternative:

```bash
cd ShineRepublic.Web
dotnet run
```

You can also simply open `ShineRepublic.Web/wwwroot/index.html` in a browser — no server needed.

## Publish to GitHub Pages

1. Create a new GitHub repository (e.g. `shine-republic`) and push this folder to the **`master`** branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `master` runs `.github/workflows/deploy-pages.yml` ("Deploy to GitHub Pages"), which uploads `ShineRepublic.Web/wwwroot` and deploys it. You can also run it manually from the **Actions** tab (*Run workflow*).
4. The site goes live at `https://<your-username>.github.io/<repo-name>/`.

> If your default branch is `main` instead, change `branches: [master]` in the workflow.
> If the deploy step fails with an environment protection error, open **Settings → Environments → github-pages** and allow the `master` branch.

## Customising for a real client

| What | Where |
| --- | --- |
| Business name, copy, services, prices, packages | `wwwroot/index.html` |
| Phone / email / WhatsApp number | `index.html` (search `000 0000` and `shinerepublic.example`) and the constants at the top of `wwwroot/js/main.js` |
| Opening hours | `index.html` (hours table, footer, JSON-LD) and `HOURS` in `js/main.js` (drives the "Open now" badge) |
| Colours & fonts | CSS variables at the top of `wwwroot/css/styles.css` |
| Map | the `<iframe>` in the *Visit* section — swap the `q=` query for the real address |
| Photos | replace files in `wwwroot/assets/img/` (keep under ~300 KB, `.webp` recommended) |
| Search engines | remove `<meta name="robots" content="noindex, nofollow">` from `index.html` when going live |

The booking form has no backend: it builds a message (service, vehicle type, date/time, name, phone, notes) and opens **WhatsApp** (`wa.me`) or the visitor's **email app** (`mailto:`). Package "Book" buttons pre-select the matching service.

---
*Demo site by Conrad Joubert. Shine Republic Car Wash & Valet is a fictional business; photos are AI-generated.*
