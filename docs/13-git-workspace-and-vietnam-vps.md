# Git repository, workspace dependencies and Vietnam VPS

Discussion: 2026-09-25. User authorized local Git initialization, commit, GitHub repository creation and push. A private repository named `wachatbot` under the connected account is the default. No VPS purchase or deployment was requested or performed. S1-006 and backend implementation remain paused.

## Local repository and publishing

The repository uses branch `main`. Local commit attribution is configured only for this repository using the connected GitHub profile name and GitHub noreply address; global Git configuration is unchanged.

Source, manifests, lockfile, tests, Markdown decisions and design exports belong in Git. `.env`, all `node_modules`, `.tools`, `.next`, build outputs, browser traces/results and private-key files are ignored. Public demo passwords and disposable local database example values are documented fixtures, not live credentials.

Before the initial commit, candidate files were checked for common credential patterns. Two matches were verified as SHA-512 package integrity values in the pnpm lockfile, not secrets. This focused inspection is not a guarantee that every possible secret format can be detected.

Local initialization and the initial commit are complete on `main`. GitHub creation/push is pending authentication: the connector identifies the connected `takashilouis` profile but exposes no repository-creation operation; GitHub CLI is unavailable, Git Credential Manager lists no GitHub account, and the browser repository-creation page redirects to sign-in. The sign-in tab is left open for the user. No remote repository has been created and no files have been pushed. After sign-in, create private `takashilouis/wachatbot`, authenticate Git through its normal flow if required, push `main`, and verify the remote commit. Never paste access tokens into documentation or chat.

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
