# Personal Portfolio | Pasha Pashazade

Static portfolio site of **Pasha Pashazade** — Senior Software Engineer focused on **Microsoft Dynamics 365 Finance and Operations (X++)**, C#/.NET integrations and Azure DevOps.

**Live site:** [winchester1723.github.io](https://winchester1723.github.io/)

## Sections

* **Overview** — short bio, a demo D365 F&O build pipeline (simulated terminal), Microsoft certifications with a link to verify them on Microsoft Learn.
* **Selected Work** — anonymized project summaries from enterprise D365 F&O work, plus side projects.
* **Technical Expertise** — Dynamics 365 F&O, backend & integration, DevOps & cloud.
* **Experience** and **Contact** — with downloadable CVs (`cv/`).

## Tech stack

Semantic HTML5, vanilla CSS (design tokens, grid/flexbox, scroll-driven progress bar), vanilla JavaScript (IntersectionObserver reveals with stagger, scroll-spy navigation, accessible mobile menu, terminal simulator, clipboard copy). Motion uses transform/opacity only and respects `prefers-reduced-motion`; content stays visible without JavaScript. Icons: [Lucide](https://lucide.dev/) (pinned version). Fonts: Inter & JetBrains Mono (Google Fonts).

## Local preview

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Updating the CVs

Source lives outside this repo (LaTeX). Rebuild the PDFs, then replace `cv/Pasha_Pashazade_CV_D365FO.pdf` and `cv/Pasha_Pashazade_CV_NET.pdf`.
