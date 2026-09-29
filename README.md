# ai-interactive-livestreaming-website

Next.js storefront and interactive AI live room.

## Included features

- AI live-room chat/host responses with fallback to local knowledge base
- Demo checkout flow with safe default guard in production
- Affiliate registration and tracking link generation
- Admin dashboard protected by bearer token
- Free-tier deployment scaffold for Render + Neon PostgreSQL

## Deployment and production checklist

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete setup and free hosting guide.

### Required environment variables

- `DATABASE_URL`: PostgreSQL connection string
- `ADMIN_API_TOKEN`: strong secret for admin auth
- `DEMO_CHECKOUT_ENABLED=false`: keep this false in production
- Optional: `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`
- Optional: `AI_API_KEY`, `AI_API_BASE_URL`, `AI_MODEL`
- Optional: `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_MODE`

### Safe defaults

- The app keeps demo checkout disabled unless you explicitly set `DEMO_CHECKOUT_ENABLED=true` in production
- AI provider calls are optional; if no API key is configured, the app falls back to stored knowledge and local templates
- PayPal is not activated unless both credentials are configured

### Production hardening

- Set real `SITE_URL` and domain metadata before launch
- Use a strong random `ADMIN_API_TOKEN`
- Store all secrets in the deployment platform's secret manager, not in code or public variables
- Keep database/network access restricted and monitor logs and rate limiting
