# RenderPort

RenderPort is a product preview for an AI model router and dedicated cloud GPUs. The pricing model passes provider rates through with 0% platform fees and 0% markup.

[Open RenderPort on GitHub Pages](https://odhasu.github.io/cpu/)

## Run locally

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

Use `npm run build` to generate the static site in `dist/`. The GitHub Actions workflow publishes it on pushes to `main`. Its relative asset paths support the GitHub Pages project path `/cpu/`.

## Pages

| Route | Purpose | Reference |
| --- | --- | --- |
| `/` | Unified API and compute overview | [OpenRouter](https://openrouter.ai/), [Higgsfield](https://higgsfield.ai/) |
| `/models/` | Searchable text, image, video and audio catalog | [OpenRouter](https://openrouter.ai/), [Kie.ai](https://kie.ai/) |
| `/pricing/` | Sample provider rates and usage estimator | [Sume API pricing](https://www.sume.com/sume-api/pricing) |
| `/gpu/` | GPU configurations and hourly rental estimates | [Higgsfield GPU](https://higgsfield.ai/gpu) |
| `/docs/` | API quickstart and playground | [OpenRouter](https://openrouter.ai/), [Kie.ai](https://kie.ai/) |

The catalog lists illustrative model and GPU rates. The playground returns local examples in Preview mode. In connected mode, it sends text requests to an OpenAI-compatible gateway that you supply. The gateway must accept CORS requests from the site for browser use. Keys are kept in memory for the current page. Production routing, account management, payment processing and GPU provisioning require backend services.
