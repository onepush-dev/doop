# Doop on Railway: open-source multiplayer design canvas (Paper.design alternative)

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/DZGXCH)

[Doop](https://github.com/kgoedecke/doop) (AGPL-3.0, by Kevin Goedecke) is a multiplayer design canvas where people and AI agents design together: frames, components, comments, a resident AI design team, and an MCP server so Claude Code, Cursor or ChatGPT can design on your canvas. This template runs it the way upstream's `docker compose up` does: Doop + Postgres 16, with uploads kept on a volume.

Image: `ghcr.io/onepush-dev/doop:0.12.0`, built by GitHub Actions from upstream's repo-root Dockerfile at commit `a3749d9` (v0.12.0) plus a small start wrapper that waits for Postgres before the boot-time migrations run.

## Services
| Service | Image | Notes |
|---|---|---|
| Doop | `ghcr.io/onepush-dev/doop:0.12.0` | public HTTPS domain, health `/healthz`, volume `/app/data` (uploaded assets) |
| Postgres | `postgres:16` | private, volume `/var/lib/postgresql/data` |

## First run
Zero inputs. Open your Railway domain, click **Sign up** and create your account. `BETTER_AUTH_SECRET` is generated per deploy and `BETTER_AUTH_URL` follows your Railway domain.

- Without SMTP, signup is open to anyone who finds the URL and auth emails (verification, password reset) are printed to the Doop logs. Set `SIGNUP_EMAIL_DOMAINS=yourcompany.com` to restrict signups, or add SMTP (`SMTP_HOST`, `SMTP_PORT` (Railway blocks 25/465/587, use 2587 with Resend), `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`).
- `ADMIN_EMAILS` promotes instance admins (requires SMTP in production).
- AI: each user can connect their own ChatGPT/OpenAI/OpenRouter/Gemini account in Settings. Set `ANTHROPIC_API_KEY` to give everyone the free Doop Agent tier.
- Uploads are stored on the volume. To use object storage instead, add a Railway Bucket and reference `BUCKET`, `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `ENDPOINT`, `REGION`.
- If you put a custom domain in front, update `BETTER_AUTH_URL` to it.

## Notes
- On Railway Doop listens on Railway's `PORT` (8080); upstream's compose publishes 4400.
- Analytics: the image is built without a PostHog key, so no product analytics are sent.
- See upstream [.env.example](https://github.com/kgoedecke/doop/blob/main/.env.example) for every option (OIDC SSO, Stripe off by default, webhooks, integrations).

## License
Doop is AGPL-3.0 by its authors. This repo only holds Railway packaging (MIT); the image contains unmodified upstream source from the pinned commit.
