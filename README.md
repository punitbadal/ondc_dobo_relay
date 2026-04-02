# ONDC Relay Service

**Production-grade, modular ONDC Relay for any Buyer App (BAP)**  
100% compliant with **ONDC Retail API v1.2.0** + **IGM v2.0** + **RSF Recon-only (PPF Model)**

Supports **all RET domains** (RET10 to RET17) with zero code changes when adding new domains.

---

## Features

- Fully domain-agnostic core (RET10–RET17 supported out-of-the-box)
- Clean REST API for any buyer backend (`/relay/v1/*`)
- Real-time normalized webhooks for all `on_*` callbacks
- Built-in ed25519 signing + verification
- Automatic domain-specific item normalization
- Full IGM v2.0 support
- RSF Recon-only (settle/on_settle removed as per PPF)
- Docker + PM2 ready for production
- Multi-tenant capable

---

## Tech Stack

- Node.js 20
- Express
- Redis (for deduplication & caching)
- PM2 (cluster mode)
- libsodium for ed25519 signing
- Docker + docker-compose

---

## Project Structure
# ondc_dobo_relay
