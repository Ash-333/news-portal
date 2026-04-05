# News Portal Features

This document describes all features implemented in the News Portal Admin (CMS).

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js + JWT tokens
- **UI Components**: Radix UI (shadcn/ui theme)
- **Rich Text Editor**: TipTap
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS

---

## 1. Content Management

### 1.1 Articles

| Feature              | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| Create Articles      | Create news articles with dual-language support (English/Nepali) |
| Edit Articles        | Edit existing articles                                           |
| Delete Articles      | Soft delete articles                                             |
| Rich Text Editor     | TipTap-based WYSIWYG editor for content                          |
| Categories           | Assign articles to categories                                    |
| Tags                 | Tag articles for better organization                             |
| Featured Image       | Select featured image for articles                               |
| Article Status       | Workflow: DRAFT → REVIEW → APPROVED → PUBLISHED → ARCHIVED       |
| Breaking News        | Mark articles as breaking news                                   |
| Featured Articles    | Flag articles as featured                                        |
| Scheduling           | Schedule articles for future publication                         |
| View Count           | Track article views                                              |
| SEO Settings         | Meta title, meta description, OG image                           |
| Approval Workflow    | Submit for review, approve, reject                               |
| Multilingual Content | Full English and Nepali content support                          |

**Admin Pages**:

- [`app/(admin)/admin/articles/page.tsx`](<app/(admin)/admin/articles/page.tsx>) - Article list
- [`app/(admin)/admin/articles/new/page.tsx`](<app/(admin)/admin/articles/new/page.tsx>) - Create new article
- [`app/(admin)/admin/articles/[id]/edit/page.tsx`](<app/(admin)/admin/articles/[id]/edit/page.tsx>) - Edit article

**API Endpoints**:

- `GET/POST /api/admin/articles` - List/create articles
- `GET/PUT/DELETE /api/admin/articles/[id]` -单个 article operations
- `POST /api/admin/articles/[id]/approve` - Approve article
- `POST /api/admin/articles/[id]/reject` - Reject article
- `POST /api/admin/articles/[id]/publish` - Publish article
- `POST /api/admin/articles/[id]/unpublish` - Unpublish article
- `POST /api/admin/articles/[id]/breaking` - Mark as breaking
- `POST /api/admin/articles/[id]/featured` - Mark as featured
- `POST /api/admin/articles/[id]/schedule` - Schedule publication

### 1.2 Categories

| Feature                 | Description                         |
| ----------------------- | ----------------------------------- |
| Create Categories       | Create news categories              |
| Hierarchical Categories | Parent/child category relationships |
| Dual Language           | English and Nepali category names   |
| Slug-based URLs         | SEO-friendly category slugs         |

**Admin Pages**:

- [`app/(admin)/admin/categories/page.tsx`](<app/(admin)/admin/categories/page.tsx>)

**API Endpoints**:

- `GET/POST /api/admin/categories` - List/create categories
- `GET/PUT/DELETE /api/admin/categories/[id]` - Category CRUD

### 1.3 Tags

| Feature        | Description                                            |
| -------------- | ------------------------------------------------------ |
| Tag Management | Create and manage article tags                         |
| Dual Language  | English and Nepali tag names                           |
| Tag Assignment | Tags can be assigned via API or UI in article forms     |

**Admin Pages**:

- [`app/(admin)/admin/tags/page.tsx`](app/(admin)/admin/tags/page.tsx)

**API Endpoints**:

- `GET/POST /api/admin/tags` - List/create tags
- `GET/PUT/DELETE /api/admin/tags/[id]` - Tag CRUD

### 1.4 Audio News

| Feature       | Description                     |
| ------------- | ------------------------------- |
| Audio Content | Manage audio news clips         |
| Audio Upload  | Upload audio files              |
| Thumbnails    | Associate thumbnail images      |
| Categories    | Categorize audio news           |
| Publishing    | Publish/unpublish audio content |
| View Tracking | Track audio news views          |

**Admin Pages**:

- [`app/(admin)/admin/audio-news/page.tsx`](<app/(admin)/admin/audio-news/page.tsx>)

**API Endpoints**:

- `GET/POST /api/admin/audio-news` - List/create audio news
- `GET/PUT/DELETE /api/admin/audio-news/[id]` - Audio news CRUD

### 1.5 Videos

| Feature             | Description              |
| ------------------- | ------------------------ |
| Video Management    | Manage video content     |
| YouTube Integration | Embed YouTube videos     |
| Thumbnails          | Auto-generate thumbnails |
| Publishing          | Publish/unpublish videos |

**Admin Pages**:

- [`app/(admin)/admin/videos/page.tsx`](<app/(admin)/admin/videos/page.tsx>)

**API Endpoints**:

- `GET/POST /api/admin/videos` - List/create videos
- `GET/PUT/DELETE /api/admin/videos/[id]` - Video CRUD

### 1.6 Flash Updates

| Feature        | Description                               |
| -------------- | ----------------------------------------- |
| Quick Updates  | Breaking news ticker content              |
| Expiration     | Set expiration for time-sensitive updates |
| Featured Image | Associate images with updates             |
| Dual Language  | English and Nepali content                |

**Admin Pages**:

- [`app/(admin)/admin/flash-updates/page.tsx`](<app/(admin)/admin/flash-updates/page.tsx>)
- [`app/(admin)/admin/flash-updates/new/page.tsx`](<app/(admin)/admin/flash-updates/new/page.tsx>)
- [`app/(admin)/admin/flash-updates/[id]/edit/page.tsx`](<app/(admin)/admin/flash-updates/[id]/edit/page.tsx>)

**API Endpoints**:

- `GET/POST /api/admin/flash-updates` - List/create flash updates
- `GET/PUT/DELETE /api/admin/flash-updates/[id]` - Flash update CRUD

### 1.7 Horoscopes

| Feature          | Description                  |
| ---------------- | ---------------------------- |
| Daily Horoscopes | Zodiac sign readings         |
| 12 Zodiac Signs  | All zodiac signs supported   |
| Icon Support     | Custom icons per sign        |
| Publishing       | Publish/unpublish horoscopes |
| Dual Language    | English and Nepali content   |

**Admin Pages**:

- [`app/(admin)/admin/horoscopes/page.tsx`](<app/(admin)/admin/horoscopes/page.tsx>)

**API Endpoints**:

- `GET/POST /api/admin/horoscopes` - List/create horoscopes
- `GET/PUT/DELETE /api/admin/horoscopes/[id]` - Horoscope CRUD

### 1.8 Polls

| Feature          | Description                  |
| ---------------- | ---------------------------- |
| Create Polls     | Interactive polling system   |
| Multiple Choice  | Single or multiple selection |
| Poll Options     | Add/edit/delete poll options |
| Scheduling       | Start/end date for polls     |
| Voting Results   | View poll results            |
| Anonymous Voting | Support guest voting by IP   |

**Admin Pages**:

- [`app/(admin)/admin/polls/page.tsx`](<app/(admin)/admin/polls/page.tsx>) - Poll list
- [`app/(admin)/admin/polls_new/page.tsx`](<app/(admin)/admin/polls_new/page.tsx>) - Create poll
- [`app/(admin)/admin/polls/[id]/edit/page.tsx`](<app/(admin)/admin/polls/[id]/edit/page.tsx>) - Edit poll
- [`app/(admin)/admin/polls/[id]/results/page.tsx`](<app/(admin)/admin/polls/[id]/results/page.tsx>) - Poll results

**API Endpoints**:

- `GET/POST /api/admin/polls` - List/create polls
- `GET/PUT/DELETE /api/admin/polls/[id]` - Poll CRUD

---

## 2. User Management

### 2.1 Users

| Feature             | Description                               |
| ------------------- | ----------------------------------------- |
| User Accounts       | Create and manage user accounts           |
| User Roles          | PUBLIC_USER, AUTHOR, ADMIN, SUPERADMIN    |
| User Status         | PENDING, ACTIVE, SUSPENDED, BANNED        |
| Profile Photos      | User profile images                       |
| Bio                 | User biography                            |
| Language Preference | English or Nepali interface               |
| Last Login          | Track last login time (lastLoginAt field) |

**Admin Pages**:

- [`app/(admin)/admin/users/page.tsx`](<app/(admin)/admin/users/page.tsx>) - User list
- [`app/(admin)/admin/users/create/page.tsx`](<app/(admin)/admin/users/create/page.tsx>) - Create user
- [`app/(admin)/admin/users/roles/page.tsx`](<app/(admin)/admin/users/roles/page.tsx>) - Role management

**API Endpoints**:

- `GET/POST /api/admin/users` - List/create users
- `GET/PUT/DELETE /api/admin/users/[id]` - User CRUD

### 2.2 Authentication

| Feature            | Description                   |
| ------------------ | ----------------------------- |
| Login              | Email/password authentication |
| Registration       | User self-registration        |
| Forgot Password    | Password reset flow           |
| Reset Password     | Reset via email link          |
| JWT Tokens         | Access and refresh tokens     |
| Session Management | NextAuth sessions             |

**API Endpoints**:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh access token

---

## 3. Media Management

### 3.1 Media Library

| Feature          | Description                      |
| ---------------- | -------------------------------- |
| Upload Media     | Upload images, videos, documents |
| Media Types      | IMAGE, VIDEO, DOCUMENT           |
| File Management  | List, view, delete media         |
| Alternative Text | Accessibility support            |
| Size Tracking    | Track file sizes                 |
| User Attribution | Track uploader                   |

**Admin Pages**:

- [`app/(admin)/admin/media/page.tsx`](<app/(admin)/admin/media/page.tsx>)

### 3.2 Featured Image Selector

| Feature         | Description                        |
| --------------- | ---------------------------------- |
| Image Selection | Select featured images for content |
| Media Modal     | Browse media library modal         |
| Preview         | Image preview before selection     |

**Components**:

- [`components/featured-image-selector.tsx`](components/featured-image-selector.tsx)
- [`components/media-library-modal.tsx`](components/media-library-modal.tsx)

---

## 4. Advertising

### 4.1 Advertisements

| Feature        | Description                      |
| -------------- | -------------------------------- |
| Ad Management  | Create and manage advertisements |
| Ad Positions   | SIDEBAR, HEADER, FOOTER, etc.    |
| Media Types    | Image or video ads               |
| Scheduling     | Set start/end dates              |
| Active Status  | Enable/disable ads               |
| Click Tracking | Track ad clicks (via linkUrl)    |

**Admin Pages**:

- [`app/(admin)/admin/ads/page.tsx`](<app/(admin)/admin/ads/page.tsx>)

**API Endpoints**:

- `GET/POST /api/admin/ads` - List/create ads
- `GET/PUT/DELETE /api/admin/ads/[id]` - Ad CRUD

---

## 5. Analytics & Reporting

### 5.1 Analytics

| Feature        | Description                    |
| -------------- | ------------------------------ |
| View Analytics | Track content views            |
| Dashboard      | Admin dashboard with stats     |
| Charts         | Visual analytics with Recharts |

**Admin Pages**:

- [`app/(admin)/admin/analytics/page.tsx`](<app/(admin)/admin/analytics/page.tsx>)

**API Endpoints**:

- `GET /api/admin/analytics` - Analytics data

### 5.2 Audit Logs

| Feature           | Description                 |
| ----------------- | --------------------------- |
| Activity Tracking | Log all admin actions       |
| User Attribution  | Track who performed actions |
| IP Tracking       | Record IP addresses         |
| User Agent        | Track browser/client info   |

**Admin Pages**:

- [`app/(admin)/admin/audit-logs/page.tsx`](<app/(admin)/admin/audit-logs/page.tsx>)

**API Endpoints**:

- `GET /api/admin/audit-logs` - List audit logs

### 5.3 Cache Management

| Feature       | Description           |
| ------------- | --------------------- |
| Redis Caching | Redis-powered caching |
| Clear Cache   | Manual cache clearing |

**API Endpoints**:

- `POST /api/admin/cache/clear` - Clear cache

---

## 6. Comments & Interactions

### 6.1 Comments

| Feature            | Description                   |
| ------------------ | ----------------------------- |
| Comment System     | User comments on articles     |
| Comment Moderation | Approve/reject/spam comments  |
| Nested Comments    | Reply to comments             |
| Like Comments      | Like comment content          |
| Report Comments    | Report inappropriate comments |

**Admin Pages**:

- [`app/(admin)/admin/comments/page.tsx`](<app/(admin)/admin/comments/page.tsx>)

**API Endpoints**:

- `GET/POST /api/admin/comments` - Admin comment management
- `GET/PUT/DELETE /api/admin/comments/[id]` - Comment CRUD
- `POST /api/admin/comments/[id]/status` - Update comment status

### 6.2 Public Comments

| Feature         | Description               |
| --------------- | ------------------------- |
| Submit Comments | Public comment submission |
| List Comments   | View article comments     |

**API Endpoints**:

- `GET/POST /api/comments` - Public comments
- `GET/PUT/DELETE /api/comments/[id]` - Comment operations

### 6.3 Bookmarks

| Feature        | Description               |
| -------------- | ------------------------- |
| Save Bookmarks | User bookmarking articles |
| Bookmark List  | User's saved articles     |

**API Endpoints**:

- `GET/POST /api/bookmarks` - Manage bookmarks

---

## 7. Settings

### 7.1 Site Settings

| Feature             | Description               |
| ------------------- | ------------------------- |
| Settings Management | Configure site options    |
| Key-Value Storage   | Flexible settings storage |

**Admin Pages**:

- [`app/(admin)/admin/settings/page.tsx`](<app/(admin)/admin/settings/page.tsx>)

**API Endpoints**:

- `GET/PUT /api/admin/settings` - Manage settings

---

## 8. Public APIs

| Feature              | Description                  |
| -------------------- | ---------------------------- |
| Public Articles      | Public article listing       |
| Public Categories    | Public category listing      |
| Public Audio News    | Public audio content         |
| Public Flash Updates | Public flash news            |
| Public Horoscopes    | Public horoscope data        |
| Public Ads           | Public advertisement serving |
| View Tracking        | Track article views          |

---

## 9. System Features

### 9.1 Role-Based Access Control

| Feature           | Description                               |
| ----------------- | ----------------------------------------- |
| Permission System | Granular permissions                      |
| Role Hierarchy    | SUPERADMIN > ADMIN > AUTHOR > PUBLIC_USER |
| Protected Routes  | Auth-guarded admin area                   |

**Implementation**:

- [`lib/permissions.ts`](lib/permissions.ts)
- [`lib/middleware/auth.ts`](lib/middleware/auth.ts)

### 9.2 Scheduled Publishing

| Feature           | Description                    |
| ----------------- | ------------------------------ |
| Cron Jobs         | Automated scheduled tasks      |
| Publish Scheduled | Auto-publish scheduled content |

**API Endpoints**:

- `POST /api/cron/publish-scheduled` - Publish scheduled articles

### 9.3 API Documentation

| Feature      | Description          |
| ------------ | -------------------- |
| Swagger UI   | Interactive API docs |
| OpenAPI Spec | API specification    |

---

## 10. UI Components

### 10.1 Core Components

| Component      | Purpose              |
| -------------- | -------------------- |
| Button         | Action buttons       |
| Card           | Content containers   |
| Data Table     | Tabular data display |
| Dialog         | Modal dialogs        |
| Dropdown Menu  | Context menus        |
| Input          | Form inputs          |
| Label          | Form labels          |
| Switch         | Toggle switches      |
| Tabs           | Navigation tabs      |
| Textarea       | Multi-line inputs    |
| Toggle         | Binary toggles       |
| Tooltip        | Hover information    |
| Status Badge   | Status indicators    |
| Role Badge     | User role display    |
| Skeleton       | Loading placeholders |
| Confirm Dialog | Confirmation dialogs |
| Empty State    | No data display      |
| Page Header    | Page titles           |
| Select         | Custom dropdown select |

### 10.2 Specialized Components

| Component               | Purpose                 |
| ----------------------- | ----------------------- |
| TipTap Editor           | Rich text editing       |
| Poll Card               | Poll display and voting |
| Featured Image Selector | Image selection UI      |
| Media Library Modal     | Media browsing          |

---

## Data Models Summary

| Model         | Description              |
| ------------- | ------------------------ |
| User          | User accounts with roles |
| Article       | News articles            |
| Category      | Content categories       |
| Tag           | Article tags             |
| Media         | Uploaded files           |
| Comment       | User comments            |
| Bookmark      | Saved articles           |
| AuditLog      | Activity logs            |
| Notification  | User notifications       |
| SiteSetting   | Site configuration       |
| Video         | Video content            |
| Advertisement | Ads management           |
| FlashUpdate   | Quick news updates       |
| Poll          | Interactive polls        |
| PollOption    | Poll choices             |
| PollVote      | Poll votes               |
| Horoscope     | Zodiac readings          |
| AudioNews     | Audio content            |

---

## API Endpoints Summary

### Admin API Routes (`/api/admin/*`)

| Endpoint                  | Features             |
| ------------------------- | -------------------- |
| `/articles`               | Full CRUD + workflow |
| `/articles/[id]/approve`  | Approve              |
| `/articles/[id]/reject`   | Reject               |
| `/articles/[id]/publish`  | Publish              |
| `/articles/[id]/breaking` | Breaking flag        |
| `/articles/[id]/featured` | Featured flag        |
| `/articles/[id]/schedule` | Schedule             |
| `/categories`             | Full CRUD            |
| `/tags`                   | Full CRUD            |
| `/media`                  | Upload + management  |
| `/users`                  | Full CRUD            |
| `/ads`                    | Full CRUD            |
| `/comments`               | Full CRUD            |
| `/polls`                  | Full CRUD            |
| `/videos`                 | Full CRUD            |
| `/audio-news`             | Full CRUD            |
| `/flash-updates`          | Full CRUD            |
| `/horoscopes`             | Full CRUD            |
| `/analytics`              | Stats dashboard      |
| `/audit-logs`             | Activity logs        |
| `/cache/clear`            | Cache management     |
| `/settings`               | Site settings        |

### Public API Routes (`/api/*`)

| Endpoint                    | Features        |
| --------------------------- | --------------- |
| `/articles`                 | List + single   |
| `/articles/[slug]/comments` | Comments        |
| `/articles/[slug]/view`     | View tracking   |
| `/categories`               | List categories |
| `/comments`                 | Submit comments |
| `/audio-news`               | List audio      |
| `/flash-updates`            | List updates    |
| `/horoscopes`               | List horoscopes |
| `/ads`                      | Get active ads  |
| `/bookmarks`                | User bookmarks  |

### Auth API Routes (`/api/auth/*`)

| Endpoint           | Features               |
| ------------------ | ---------------------- |
| `/login`           | User login             |
| `/register`        | User registration      |
| `/forgot-password` | Password reset request |
| `/reset-password`  | Password update        |
| `/refresh-token`   | Token refresh          |
| `/invite`          | Invitation acceptance  |
| `/[...nextauth]`   | NextAuth handlers      |

---

## Recent Updates (2026-04-05)

- Added Tags management page (`/admin/tags`)
- Added Tag selection in article create/edit forms
- Created custom Select component for better UX
- Fixed auth middleware to use NextAuth sessions
- Added auth endpoints: /api/auth/me, /api/auth/logout, /api/auth/profile, /api/auth/change-password
- Fixed comment posting to show correct user
- Fixed server-side language selection for public portal

_Document generated from codebase analysis_
