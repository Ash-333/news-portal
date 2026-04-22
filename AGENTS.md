# News Portal - Agent Guidance

## Project Structure

This is a monorepo with two Next.js applications:

| Directory | Purpose | Port |
|----------|---------|------|
| `admin_panel/` | Admin CMS for content management | 3000 |
| `public_portal/` | Public-facing news website | 3001 |

## Essential Commands

```bash
# Admin Panel
cd admin_panel
npm run dev      # Development server
npm run build    # Production build
npx prisma generate   # Generate Prisma client after schema changes
npx prisma db push   # Apply schema changes to database
npx prisma db seed   # Seed database with sample data

# Public Portal
cd public_portal
npm run dev
npm run build
```

## Schema Changes

After modifying `prisma/schema.prisma`:
1. Run `npx prisma generate`
2. Run `npx prisma db push` (or `npx prisma migrate dev` for new migrations)
3. If data loss is expected, use `--accept-data-loss` flag

## Key Patterns

### API Calls with 401 Handling
Admin panel intercepts all `/api/` fetch responses. On 401, it auto-logouts and redirects to `/login` with a toast message.

### Language Context
Both apps use `LanguageContext` for bilingual support. Use `useLanguage()` hook to get:
- `isNepali: boolean` - Current language
- `t: function` - Translation function

### TanStack Query
Both apps use TanStack Query for data fetching. Mutations automatically invalidate related queries.

## Recent Schema Changes

- **Province enum removed**: Province was a separate field on Article. Now use category/subcategory system instead.
- **isBreaking removed**: The breaking news flag was removed from Article model.

## Common Issues

- Build fails after schema change → Run `npx prisma generate`
- 401 errors → Check authentication middleware
- Type errors in hooks → Verify API response types match

## Pre-commit / CI

No pre-commit hooks configured. Run `npm run build` before pushing to verify type safety.
