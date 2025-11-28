# Deployment Documentation

## Overview

This document describes the deployment infrastructure used for the Sokol Skuhrov website.

---

## Email Forwarding (improvemx.com)

The website uses **Improvemx.com** for email forwarding services.

### Configured Email Addresses

- `prihlasky@sokolskuhrov.cz` - forwards registration emails
- `webteam@sokolskuhrov.cz` - forwards web team emails

### Administrator Account

- **Service:** [improvemx.com](https://improvemx.com)
- **Note:** Contact web team at webteam@sokolskuhrov.cz for access

### Purpose

Email forwarding allows receiving emails at sokolskuhrov.cz domain addresses without requiring a full email server setup.

---

## Hosting & Deployment (Vercel)

The website is hosted and deployed on **Vercel**.

### Account Details

- **Account type:** Shared account
- **Account alias:** `webteam@sokolskuhrov.cz`
- **Platform:** [Vercel](https://vercel.com)

### Deployment Process

1. Content changes are committed to the GitHub repository main branch
2. Vercel automatically detects changes via webhook
3. The site is rebuilt and deployed automatically
4. New version goes live within minutes

---

## DNS Management (Forpsi)

DNS records for the domain are managed through **Forpsi**.

### Service Details

- **Provider:** Forpsi
- **Domain:** `sokolskuhrov.cz`
- **Purpose:** DNS record management (A records, CNAME, MX, etc.)

---

## Access & Credentials

### Vercel

- Access via email alias: `webteam@sokolskuhrov.cz`

### Improvemx

- Contact web team for access

### Forpsi

- Contact web team for access
