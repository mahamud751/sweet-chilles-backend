# Savasaachi Growth Engine — Backend

NestJS + Prisma + PostgreSQL + Swagger.

## Setup

```bash
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

- API: http://localhost:4000  
- Swagger: http://localhost:4000/api/docs  

## Modules

| Module | Purpose |
|--------|---------|
| `restaurants` | White-label branding per slug |
| `auth` | Member register/login, staff login |
| `vouchers` | Wallet + QR redemption (loyalty journey) |
| `competitions` | Phase 1 acquisition campaigns |
| `dashboard` | Owner stats (members, revenue, redemptions) |
| `campaigns` | Birthday / inactive / quiet day templates |

## Loyalty automation

Redeeming a voucher via `POST /vouchers/redeem` automatically:

1. Marks voucher redeemed  
2. Advances member stage  
3. Issues next voucher (20% → 15% → loyalty ×5 → Gold 10%)  
4. Creates in-app notification  

## New restaurant tenant

1. Insert row in `Restaurant` (unique `slug`)  
2. `POST /campaigns/restaurants/:id/seed-templates`  
3. Point mobile app `RESTAURANT_SLUG` to new slug  
