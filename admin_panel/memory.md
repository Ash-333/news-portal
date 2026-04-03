# Project Memory

## Important Notes for This Project

### Architecture
This is an **admin portal (CMS)** that works alongside a **separate public frontend** application. The public frontend uses all the public APIs from this admin portal.

### API Usage by Public Frontend
The public frontend consumes these public APIs:
- `/api/comments` - Create and list comments
- `/api/articles` - Get articles
- `/api/categories` - Get categories
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- Other public endpoints...

### Comment System Changes Made

1. **Auto-approve all comments** - Comments are approved immediately when submitted (no pending status)
   - File: `app/api/comments/route.ts`

2. **Admin can only delete comments** - Removed approve/reject/spam functionality
   - File: `app/(admin)/admin/comments/page.tsx`

3. **Created DELETE API** - Admins can delete comments
   - Endpoint: `DELETE /api/admin/comments/:id`
   - File: `app/api/admin/comments/[id]/route.ts`

### Debug Logging (for testing)
Debug logs were added to help troubleshoot issues:
- `lib/middleware/auth.ts` - Logs token info
- `app/api/comments/route.ts` - Logs user ID on comment submission

Remove these debug logs after testing is complete.
