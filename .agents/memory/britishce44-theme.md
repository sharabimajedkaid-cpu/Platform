---
name: Britishce44 brand theme
description: Brand palette, token role mapping, and recolor gotchas for the Britishce44 web app theme
---

# Britishce44 brand theme

Brand palette extracted from britishce4.com (المركز البريطاني الأول), replacing the old dark navy (#07102a) / gold (#c8940a) theme:
- primary / deep indigo: **#150D79**
- secondary / sky blue: **#3FBAEB**
- accent + link / green: **#00AE74**
- background white, body text #333

## Token role mapping (artifacts/britishce44/src/index.css)
- `--primary` = logo green (CTA buttons), `--secondary` = deep indigo, `--accent` = sky blue.

## Gotchas (durable)
- **Green primary needs a DARK foreground, not white.** White on #00AE74 is ~2.9:1 (fails WCAG AA). Use deep indigo text (#17125c ≈ `hsl(244 64% 16%)`) for ~5.8:1. `--primary-foreground` is deep indigo in BOTH `:root` and `.dark`; the login CTA hard-codes `color:#17125c` on its green gradient for the same reason.
  **Why:** an earlier pass left white-on-green buttons that failed AA.
- **Exclude `components/classroom/whiteboard-area.tsx` from any global color sweep** — it holds the whiteboard PEN color palette, which must stay full-spectrum, not brand colors.
- **Preserve semantic colors when recoloring.** amber/orange = warning/pending/maintenance, red = critical, green = success. A blind gold→green substitution inverts meaning — it made anticheat high-risk, academic-room pending-payment/partial/exam, and the maintenance toggle read as "safe" green. Map warning/pending → amber (#f59e0b / #fbbf24), critical → red, high-risk → orange (#f97316), NOT brand green.
- `GOLD` const in `pages/anticheat.tsx` now equals brand green #00ae74 — fine for the neutral "Total Detections" stat, but must NOT be reused for warn/risk severity.
