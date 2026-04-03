# News Portal Admin Panel

A complete bilingual (Nepali + English) news portal admin panel built with Next.js 14, TypeScript, and PostgreSQL.

## Features

### Admin Panel
- **Dashboard** - Overview with stats, charts, and pending items
- **Articles Management** - Create, edit, publish, and manage articles in both languages
- **Media Manager** - Upload and manage images, videos, and documents
- **Categories & Tags** - Organize content with hierarchical categories
- **Comments Moderation** - Approve, reject, and manage user comments
- **User Management** - Invite users, manage roles and permissions
- **Analytics** - View traffic stats, top articles, and author performance
- **Audit Logs** - Track all system actions (SuperAdmin only)
- **Settings** - Configure site settings, email, and security (SuperAdmin only)

### User Roles
- **Public User** - Can read articles, comment, and bookmark
- **Author** - Can create and submit articles for review
- **Admin** - Can publish articles, manage content, and moderate comments
- **SuperAdmin** - Full system control including user management and settings

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript (Strict Mode)
- Tailwind CSS
- shadcn/ui components
- TanStack Query (React Query)
- React Hook Form + Zod
- Recharts for analytics
- TipTap for rich text editing
- Lucide React icons
- Sonner for toast notifications

### Backend
- Next.js API Routes
- PostgreSQL database
- Prisma ORM
- NextAuth.js (credentials + OAuth)
- In-memory cache for sessions and rate limiting
- Bcrypt for password hashing
- Local file storage in `public/uploads`

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

1. Clone the repository and install dependencies:
```bash
cd news-portal
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/news_portal?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Upload storage
# Files are stored locally in public/uploads
```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials

After setting up, you can create the first SuperAdmin user by visiting:
```
http://localhost:3000/api/auth/register
```

Or use the default credentials if you've seeded the database:
- Email: `admin@example.com`
- Password: `admin123`

## Database Schema

The application uses the following main entities:

- **User** - System users with roles (PUBLIC_USER, AUTHOR, ADMIN, SUPERADMIN)
- **Article** - Bilingual news articles with status workflow
- **Category** - Hierarchical content categories
- **Tag** - Article tags for organization
- **Comment** - User comments with moderation
- **Bookmark** - User saved articles
- **Media** - Uploaded files storage
- **AuditLog** - System action tracking
- **Notification** - User notifications
- **SiteSetting** - System configuration

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/invite` - Invite new staff user (Admin+)

### Users
- `GET /api/users` - List users (Admin+)
- `GET /api/users/:id` - Get user details (Admin+)
- `PATCH /api/users/:id` - Update user (SuperAdmin)
- `DELETE /api/users/:id` - Delete user (SuperAdmin)
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile

### Articles
- `GET /api/articles` - List published articles (public)
- `GET /api/articles/:slug` - Get single article (public)
- `GET /api/admin/articles` - List all articles (Author+)
- `POST /api/admin/articles` - Create article (Author+)
- `PATCH /api/admin/articles/:id` - Update article
- `DELETE /api/admin/articles/:id` - Delete article (Admin+)
- `PATCH /api/admin/articles/:id/publish` - Publish article (Admin+)
- `PATCH /api/admin/articles/:id/approve` - Approve article (Admin+)

### Categories & Tags
- `GET /api/admin/categories` - List categories (Admin+)
- `POST /api/admin/categories` - Create category (Admin+)
- `PATCH /api/admin/categories/:id` - Update category (Admin+)
- `DELETE /api/admin/categories/:id` - Delete category (Admin+)
- Similar endpoints for tags

### Comments
- `GET /api/comments` - List approved comments (public)
- `POST /api/comments` - Create comment (authenticated)
- `GET /api/admin/comments` - List all comments (Admin+)
- `PATCH /api/admin/comments/:id/status` - Update comment status (Admin+)

### Analytics
- `GET /api/admin/analytics?type=overview` - Get overview stats (Admin+)
- `GET /api/admin/analytics?type=articles` - Get top articles (Admin+)
- `GET /api/admin/analytics?type=authors` - Get author stats (Admin+)

### System
- `GET /api/admin/settings` - Get settings (SuperAdmin)
- `PATCH /api/admin/settings` - Update settings (SuperAdmin)
- `POST /api/admin/cache/clear` - Clear cache (SuperAdmin)
- `GET /api/admin/audit-logs` - View audit logs (SuperAdmin)

## Project Structure

```
news-portal/
├── app/
│   ├── (admin)/           # Admin panel routes
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   └── admin/         # Admin pages
│   ├── (public)/          # Public portal routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── providers.tsx      # Context providers
│   └── globals.css        # Global styles
├── components/
│   ├── admin/             # Admin-specific components
│   ├── ui/                # Reusable UI components
│   └── public/            # Public portal components
├── hooks/                 # TanStack Query custom hooks
├── lib/
│   ├── prisma.ts          # Prisma client
│   ├── redis.ts           # Redis client
│   ├── auth.ts            # NextAuth config
│   ├── middleware/        # API middleware
│   ├── validations/       # Zod schemas
│   └── storage.ts         # R2/S3 storage
├── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## Deployment

### Vercel (Frontend)
1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Railway/Render (Database)
1. Create PostgreSQL database
2. Update DATABASE_URL

### Docker With External PostgreSQL
This project already includes a `Dockerfile` and `docker-compose.yml` for running only the Next.js app. That is the right fit when PostgreSQL is managed separately on your aaPanel VPS.

1. Put your real production connection string in `.env`:
```env
DATABASE_URL="postgresql://db_user:db_password@your-vps-db-host:5432/news_portal?schema=public"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-a-long-random-secret"
APP_URL="https://your-domain.com"
ADMIN_URL="https://your-domain.com/admin"
```

2. Build and start the container:
```bash
docker compose up -d --build
```

3. Run Prisma migrations against the remote database when you deploy schema changes:
```bash
docker compose exec app npx prisma migrate deploy
```

4. If you want seed data once:
```bash
docker compose exec app npx prisma db seed
```

Notes:
- `docker-compose.yml` no longer starts a local PostgreSQL container.
- The app container reads all secrets from `.env`.
- Uploaded files are persisted in the `uploads_data` Docker volume.
- Make sure your VPS firewall allows the app server to connect to PostgreSQL on the configured host and port.

## Security Considerations

- All API routes are protected with authentication middleware
- Role-based access control enforced server-side
- Rate limiting on login, comments, and API endpoints
- Passwords hashed with bcrypt (12 rounds)
- CSRF protection via NextAuth
- Input validation with Zod
- Soft deletes for users and articles
- HTTPS enforced in production

## License

MIT License - feel free to use this project for your own news portal.

## Support

For issues and feature requests, please open an issue on GitHub.
