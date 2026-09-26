# Remote Docker options for the GA laptop

Discussed 2026-09-25. No cloud environment has been provisioned, no paid plan selected and no local Docker/WSL installation attempted.

## Recommendation

Yes, containers can run on an online development machine or hosting service while this laptop uses a browser. Local Docker/WSL2 is not necessary for that arrangement. It still needs an organization-approved service and permission to put source code, secrets and data there; this is not a way to bypass GA controls.

For this project, continue local FE now. When backend work resumes, use an approved **GitHub Codespaces** environment for development if available, then a separate persistent staging environment for the WhatsApp demo and friend pilot. Codespaces gives a remote Linux development container and can be used in a browser. Configure its container features for the Docker Engine/Compose workflow, verify PostgreSQL and Redis persistence, and rerun S1-006 before marking it complete. Do not assume the current repository already contains a devcontainer configuration: it does not.

| Option | Use here | Tradeoffs |
|---|---|---|
| GitHub Codespaces | Remote backend development, terminal and tests, accessed through browser/VS Code | Organization access and usage quotas/billing apply. A development environment can stop; unsuitable as the only continuously available webhook server |
| Approved Linux VM with Docker Engine | Full control over Compose, PostgreSQL, Redis, API and worker | Requires maintenance, HTTPS, backups, access management and monitoring. A browser terminal can avoid any local Docker CLI; an approved CLI can also use a remote context over SSH |
| Managed container host such as Railway | Persistent demonstration API/worker and public HTTPS webhook, with appropriately configured database and Redis services | Requires deployment configuration, secrets, persistence, health checks and a suitable paid/resource plan. Dockerfile support does not imply unchanged Compose deployment |

Docker Hub stores images; it is not the machine that runs this application. Temporary public container playgrounds are unsuitable for durable pilot data and a stable Meta webhook.

## When backend work resumes

1. Choose the approved provider, account owner, region and spending limit under S1-004.
2. Provision a private development environment; keep real credentials in its secret manager.
3. Verify Node/pnpm versions and the retained PostgreSQL/Redis configuration; test restarts and actual database/queue operations.
4. Resume S1-006 acceptance, then persistence and real auth before protected business functionality.
5. Deploy persistent staging with HTTPS, server-only Meta/AI tokens and backup/recovery. For the pilot, make availability independent of a developer terminal or sleeping Codespace.

Use SSH/TLS and access controls for a remote Docker engine. Do not expose an unauthenticated Docker TCP endpoint. No credentials belong in frontend public variables or browser storage.

## Sources

- [GitHub: What are Codespaces?](https://docs.github.com/en/codespaces/about-codespaces/what-are-codespaces) — cloud development containers, browser access and lifecycle.
- [Docker contexts](https://docs.docker.com/engine/manage-resources/contexts/) — target different Docker engines from a client.
- [Railway Dockerfiles](https://docs.railway.com/builds/dockerfiles) — container deployment support.

Recommendations are specific to the current architecture and constraints; these providers have not been selected by the user.
