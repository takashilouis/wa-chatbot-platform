# Git repository, workspace dependencies and Vietnam VPS

Discussion: 2026-09-25. User authorized local Git initialization, commit, GitHub repository creation and push. A private repository named `wachatbot` under the connected account is the default. No VPS purchase or deployment was requested or performed. S1-006 and backend implementation remain paused.

## Local repository and publishing

The repository uses branch `main`. Local commit attribution is configured only for this repository using the connected GitHub profile name and GitHub noreply address; global Git configuration is unchanged.

Source, manifests, lockfile, tests, Markdown decisions and design exports belong in Git. `.env`, all `node_modules`, `.tools`, `.next`, build outputs, browser traces/results and private-key files are ignored. Public demo passwords and disposable local database example values are documented fixtures, not live credentials.

Before the initial commit, candidate files were checked for common credential patterns. Two matches were verified as SHA-512 package integrity values in the pnpm lockfile, not secrets. This focused inspection is not a guarantee that every possible secret format can be detected.

Local initialization and the initial commit are complete on `main`. On 2026-09-26 the user created [takashilouis/wa-chatbot-platform](https://github.com/takashilouis/wa-chatbot-platform) and explicitly requested a push. GitHub metadata confirms this repository is public, empty before the initial push, and writable by the connected account. This user-created name and visibility supersede the earlier private `wachatbot` proposal. The local `origin` is to point to its HTTPS clone URL; publish `main` without force and verify that the remote commit matches local HEAD. Never paste access tokens into documentation or chat.

## Why node_modules exists at the root

This project is a pnpm workspace (one repository with several packages). Both frontend and backend use Node.js:

```text
wachatbot/
  package.json                 Shared scripts and dev tools
  pnpm-workspace.yaml          Declares the three application packages
  pnpm-lock.yaml               Shared reproducible dependency resolution
  node_modules/               Root tools and pnpm virtual store (.pnpm)
  frontend/
    package.json               Next.js, React, browser tests
    node_modules/              Links for this package's dependencies
  backend/
    api/
      package.json             NestJS application dependencies
      node_modules/
    worker/
      package.json             Worker package dependencies
      node_modules/
```

Root TypeScript, ESLint, pnpm and process-runner dependencies serve the workspace. The package manifests determine ownership; filesystem links let pnpm reuse installed packages. The global content-addressed pnpm store and the workspace's `.pnpm` virtual store are related but distinct. See [pnpm's dependency layout](https://pnpm.io/symlinked-node-modules-structure).

Do not manually move the root node_modules into frontend: it would break the workspace's tools/links. It is ignored by Git and rebuilt with `pnpm install --frozen-lockfile` after cloning. Separate applications do not require separate repositories or duplicate installs. When deployment is implemented, each image should contain only the files and runtime dependencies its service requires; do not upload Windows node_modules to Linux.

## Should this project use a Vietnam VPS?

Yes, an approved Linux VPS in Vietnam can host Docker Engine and Compose, without Docker Desktop or WSL2 on the laptop. For FE-only work, purchasing immediately is unnecessary. A month-to-month VPS becomes useful when resuming backend and preparing stable public HTTPS webhooks for the demo.

My starting estimate for the small friend pilot is **4 vCPU, 8 GB RAM and 60–80 GB SSD/NVMe**, Ubuntu 24.04 LTS, a public IPv4 address and root/sudo access. This is engineering sizing, not a measured capacity guarantee. A 2-vCPU/4-GB instance may fit a small prebuilt deployment, but offers less headroom for the API, worker, Next server, PostgreSQL, Redis and image builds together. Build images elsewhere when possible. No GPU is needed if AI inference uses a hosted API. Ubuntu 24.04 is listed in [Docker's supported Ubuntu installation guide](https://docs.docker.com/engine/install/ubuntu/).

Start with one VM and Compose for the demo; a single VM is a single failure domain. Keep database/Redis private, expose the application through HTTPS, and maintain backups outside that VM. A Compose volume alone is not a backup. Kubernetes is unnecessary for this stage. The current Compose file only defines PostgreSQL/Redis; application Dockerfiles and a complete deployment are still future work.

## Provider shortlist

Prices and product pages checked 2026-09-25. Prices are advertised snapshots, not quotes or performance measurements. Confirm current billing term, renewal price, VAT, disk expansion, public IP, backups and international transfer limits before purchase.

| Provider | Verified offering | Fit and recommendation |
|---|---|---|
| [VNPT Cloud Server](https://cloud.vnpt.vn/dich-vu/cloud-server) | SMC03: 2 vCPU / 4 GB / 20 GB SSD, VND 379,000 per month. SMC05: 4 vCPU / 8 GB / 40 GB SSD, VND 759,000 per month. Listed prices exclude VAT | Most concrete starting comparison: request SMC05 with 60–80 GB total disk and off-VM backup pricing. The published 40 GB disk is below my preferred headroom |
| [Vietnix VPS](https://vietnix.vn/vps/) | Official indexed product pages list VPS/AMD/NVMe offerings. Direct pricing pages returned redirect loops during this research | Budget comparison candidate: request a monthly 4-vCPU/8-GB NVMe quote and explicit international bandwidth terms. No unverified current price is quoted |
| [VNG Cloud vServer](https://www.vngcloud.vn/vi/product/vserver) | VM service with VPC, security groups, monitoring, backup options and pay-as-you-go billing | Consider if a broader cloud platform and later managed-service expansion matter. Obtain a calculator quote for the same resource size; no complete numeric price was available in the fetched page |

My provisional choice: compare VNPT SMC05 plus disk/backup expansion against Vietnix's equivalent month-to-month offer. Prefer whichever performs better in an actual trial and provides clear support/network terms. Do not commit to a long discounted term before measuring the service.

## Will Vietnam be too slow?

Location alone cannot answer this; no provider has been benchmarked for this project. A Vietnam region is a reasonable candidate for Vietnamese staff accessing the website, but the chatbot's critical path also involves international providers:

```text
Customer WhatsApp → Meta platform → Vietnam API/queue
                 → hosted AI provider → Vietnam API → Meta → customer
Staff website    → Vietnam API → local database/Redis
```

Keeping API, worker, PostgreSQL and Redis close together avoids unnecessary WAN round trips for internal work. Network quality to Meta and the AI provider, model response time, prompt size, retries and queue delay all affect perceived speed. A local VPS does not make Meta or hosted AI local, nor does it automatically keep all customer data in Vietnam. A published domestic port speed is not an international latency guarantee. Working from abroad may also make remote development less responsive than local FE work.

Use a trial or one-month plan and measure from the actual VPS and intended staff networks: HTTPS latency/loss to relevant provider endpoints, representative complete AI responses, and end-to-end WhatsApp messages when implemented. Sample peak/off-peak times and report median, p95 and timeout rate; unauthenticated HTTP timing alone does not benchmark inference. Retain the existing demo goal of 90% of substantive responses within 15 seconds; it is an acceptance target, not a current result. Compare a Singapore deployment if international routing is the bottleneck.

Ask the shortlisted host specifically for Linux VM/root access, Docker support, domestic versus international bandwidth guarantees, transfer caps/fair-use policy, backup restoration, resizing downtime, and the actual Vietnam data-center location. No machine purchase is necessary to finish the current FE task.

## Bluehost comparison — 2026-09-25

User compared 2 vCPU / 4 GB RAM / 100 GB NVMe against 4 vCPU / 8 GB RAM / 200 GB NVMe. Both are plausible for this project; prefer the 8 GB option for running Next.js, API, worker, PostgreSQL and Redis together. The 4 GB option is a budget demo starting point with prebuilt images, modest concurrency and memory monitoring. Neither is a measured capacity guarantee or a recommendation to run a large language model locally. More RAM matters more here than the extra disk or the DDR5 label.

The supplied advertising URL could not be fetched; research used Bluehost's current canonical pages. [VPS plans](https://www.bluehost.com/vps-hosting) advertise the matching self-managed sizes at $9.49/$12.99 monthly equivalents for 24 months, renewing at $11.99/$28.99. Listed upfront totals are $227.76/$311.76, excluding applicable taxes. Locations listed are Virginia, Arizona, London, Toronto and Amsterdam; Vietnam/Singapore are not listed. Confirm the exact checkout offer and region. “Unmetered” remains subject to usage conditions; it does not guarantee speed. The page includes an ambiguous generic resource-limit notice: clarify its applicability to allocated VPS CPU before committing.

[Bluehost Docker hosting](https://www.bluehost.com/vps-hosting/docker) explicitly supports Docker with root access. Its self-managed support covers infrastructure; OS updates, containers, application deployment, monitoring and backups remain our responsibility. For this stack, choose plain Linux without unnecessary cPanel/WordPress extras.

Recommendation: the 8 GB specification is a good fit for our intended small pilot, but Bluehost is only a conditional provider choice. Given Vietnamese staff, compare a Vietnam or Singapore host's actual routing and total renewal cost before buying a long term. No purchase or deployment is authorized by this comparison; backend remains paused. GitHub publication remains pending the previously requested sign-in.

## Vercel frontend + VPS backend — 2026-09-25

User proposed splitting hosting between Vercel and a 4 GB VPS. This is a recommended option for the small Phase 1 pilot, subject to measurement. Moving the Next.js build/runtime to Vercel reduces VPS workload, so **2 vCPU / 4 GB RAM / 100 GB NVMe** is a reasonable starting estimate for API, worker, PostgreSQL, Redis and an HTTPS reverse proxy. The earlier 8 GB preference assumed the frontend also ran on that VM. Neither estimate establishes measured capacity; backend load tests still remain outstanding.

Proposed deployment:

- `app.example.com`: Next.js frontend on Vercel, built there.
- `api.example.com`: HTTPS API and future live inbox connection endpoint on VPS.
- VPS private container network: API, bounded-concurrency worker, PostgreSQL and Redis. Meta webhooks go directly to the API. Hosted AI requests originate from the backend.
- Off-VM backups; build backend images in CI rather than on the small running VM where possible. No local model inference or heavy document processing on this starting size.

Staff browsers load the frontend from Vercel and call the VPS API. Use exact allowed CORS origins, server authorization and a deliberate Secure/HttpOnly cookie and CSRF design; sibling custom domains avoid relying on cross-site cookies between unrelated hosting domains. A same-origin proxy is an alternative supported by [Vercel external rewrites](https://vercel.com/docs/routing/rewrites), but adds routing and must be evaluated separately for live connections. These controls are design requirements, not implemented features: current login remains simulated and BE paused.

Frontend delivery improves independently, but the bot's Meta/AI/backend response path does not pass through the frontend. Vercel cannot eliminate latency between a remote VPS and Meta/AI or staff API requests. If Next server rendering/functions call the API, choose a nearby function region; CDN asset delivery and function execution are different. See [Vercel function regions](https://vercel.com/docs/functions/configuring-functions/region).

Keep worker concurrency and database connections modest, bound Redis memory/retention without evicting durable queue work, rotate logs and monitor CPU, available RAM, swap, restart/OOM events and response time. Upgrade toward 8 GB if sustained pressure, swapping or queue delays remain after tuning. Do not size solely by a user-count claim. Validate the existing five-conversation demo load on the deployed system.

Cost: include VPS, backup/storage and the appropriate Vercel plan. [Vercel Hobby](https://vercel.com/docs/plans/hobby) is restricted to personal non-commercial use; do not assume a business chatbot can use free Hobby just because traffic is low. An appropriate paid plan may make a single larger VPS cheaper overall, while Vercel still offers convenient frontend deployment and previews.

Decision status: recommendation documented, no purchase/deployment or backend resumption performed. Monorepo deployment configuration and real authentication must be completed before a real pilot.
