# HTC Media — News Portal Handover Documentation

**From:** HTC Media
**To:** Lightweb Group
**Project:** Bilingual (Nepali/English) News Portal
**Document Version:** 1.0
**Date:** August 2026

> This document is the consolidated handover package for the HTC Media News Portal. It covers UML diagrams, database design, technical details, API documentation, server details, deployment, DevOps, code repository, end-user training materials, and the security audit.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [UML Diagrams](#2-uml-diagrams)
   - 2.1 Use Case Diagram
   - 2.2 System Sequence Diagrams
   - 2.3 Entity Relationship (ER) Diagram
   - 2.4 Data Flow Diagram (DFD)
3. [Database Design Documents](#3-database-design-documents)
   - 3.1 Database Schema
   - 3.2 Stored Procedure Documentation
   - 3.3 Triggers Documentation
   - 3.4 Views Documentation
4. [Technical Details](#4-technical-details)
   - 4.1 Tech Stack
   - 4.2 Programming Languages
   - 4.3 Technologies
   - 4.4 Dependencies Documentation
5. [API Documentation](#5-api-documentation)
   - 5.1 API Documentation
   - 5.2 API Catalogue
6. [System Server Details](#6-system-server-details)
   - 6.1 Hosted Servers
   - 6.2 IP Addresses
   - 6.3 Mapped Subdomains
7. [Deployment Guide, Architecture and Configurations](#7-deployment-guide-architecture-and-configurations)
   - 7.1 Deployment Guide
   - 7.2 Deployment Architecture
   - 7.3 Deployment Configurations
8. [DevOps Details with Configurations](#8-devops-details-with-configurations)
9. [Code Repository](#9-code-repository)
10. [SOP for Users and Training Materials](#10-sop-for-users-and-training-materials)
    - 10.1 User Manual
    - 10.2 Admin Manual
    - 10.3 Training Materials
11. [Security Audit](#11-security-audit)
    - 11.1 SSL Certificate
    - 11.2 Other Security Controls

---

## 1. System Overview

The HTC Media News Portal is a production-ready, bilingual (Nepali + English) digital news publishing platform. It consists of three main software components orchestrated with Docker:

| Component | Directory | Container | Port | Role |
|-----------|-----------|-----------|------|------|
| Admin Panel | `admin_panel/` | `admin_panel` | 3000 | Content management, user/auth, media, analytics, **and hosts the public REST API** |
| Public Portal | `public_portal/` | `public_portal` | 3001 | Public-facing news website (SSR/ISR), SEO, sitemaps |
| Scheduler | `admin_panel/scheduler/` | `scheduler` | — | Background jobs (scheduled publishing, AI summaries) |

### 1.1 High-Level Architecture Flow

```mermaid
flowchart LR
    A[Public Visitor] --> B[Public Portal<br/>Next.js 14 :3001]
    B -->|REST /api/*| C[Admin Panel API<br/>Next.js 16 :3000]
    C --> D[(PostgreSQL<br/>Neon)]
    C --> E[(Cloudflare R2<br/>object storage)]
    F[Admin/Author] --> G[Admin Panel UI<br/>:3000/admin]
    G --> C
    H[Scheduler container] -->|reads/writes| C
    H -->|auto-publish + AI summary| D
    I[Cron / external trigger] -->|GET /api/cron/publish-scheduled| C
    A -->|static assets / uploads| E
```

- The **Admin Panel** acts as the API backend. The **Public Portal** consumes these APIs (server-side via `API_URL`, client-side via `NEXT_PUBLIC_API_URL`).
- Media (images, videos, documents) is uploaded to **Cloudflare R2** (S3-compatible) via the admin panel; the public portal loads media directly from the R2 public URL.
- The **scheduler** runs scheduled-article publishing every minute and generates AI article summaries hourly using OpenRouter.

---

## 2. UML Diagrams

> Diagrams are provided in Mermaid syntax, which renders natively on GitHub and most Markdown viewers. Editable source files for each diagram are also included in the repository under `docs/diagrams/` where applicable.

### 2.1 Use Case Diagram

Actors: **Public Visitor**, **Registered User**, **Author**, **Admin**, **SuperAdmin**, and **Scheduler**.

```mermaid
flowchart TB
    Visitor([Public Visitor])
    User([Registered User])
    Author([Author])
    Admin([Admin])
    SuperAdmin([SuperAdmin])
    Sched([Scheduler/Cron])

    subgraph PublicPortal[Public Portal]
        P1[Browse articles / homepage]
        P2[Search articles]
        P3[Read article detail]
        P4[View videos / audio news / photo galleries]
        P5[View polls and horoscopes]
        P6[View ads]
        P7[View team / contact / about]
    end

    subgraph Interactive[Interactive Features]
        I1[Register / Login]
        I2[Comment on articles]
        I3[Bookmark articles]
        I4[Vote in polls]
        I5[Rate/ like content]
    end

    subgraph AdminPanel[Admin Panel]
        A1[Manage articles]
        A2[Publish / unpublish / schedule articles]
        A3[Approve / reject articles]
        A4[Manage categories & tags]
        A5[Moderate comments]
        A6[Manage media files]
        A7[Manage ads]
        A8[Manage polls & horoscopes]
        A9[Manage videos / audio news / photo galleries]
        A10[Manage team members & authors]
        A11[View analytics]
        A12[Manage users & roles]
        A13[Audit logs]
        A14[Site settings & cache clear]
    end

    Visitor --> P1
    Visitor --> P2
    Visitor --> P3
    Visitor --> P4
    Visitor --> P5
    Visitor --> P6
    Visitor --> P7

    User --> I1
    User --> I2
    User --> I3
    User --> I4
    User --> I5

    Author --> A1
    Author --> A3

    Admin --> A1
    Admin --> A2
    Admin --> A3
    Admin --> A4
    Admin --> A5
    Admin --> A6
    Admin --> A7
    Admin --> A8
    Admin --> A9
    Admin --> A11

    SuperAdmin --> A1
    SuperAdmin --> A2
    SuperAdmin --> A3
    SuperAdmin --> A4
    SuperAdmin --> A5
    SuperAdmin --> A6
    SuperAdmin --> A7
    SuperAdmin --> A8
    SuperAdmin --> A9
    SuperAdmin --> A10
    SuperAdmin --> A11
    SuperAdmin --> A12
    SuperAdmin --> A13
    SuperAdmin --> A14

    Sched -->|Auto-publish scheduled articles| A2
    Sched -->|Generate AI summaries| A1
```

### 2.2 System Sequence Diagrams

#### 2.2.1 Read an Article (Public Flow)

```mermaid
sequenceDiagram
    participant V as Visitor (Browser)
    participant PP as Public Portal (3001)
    participant API as Admin Panel API (3000)
    participant DB as PostgreSQL
    participant R2 as Cloudflare R2

    V->>PP: GET /article/{slug}
    PP->>API: GET /api/articles/{slug}
    API->>DB: Query article + tags + author + category
    DB-->>API: Article row(s)
    API-->>PP: JSON {success, data: article}
    PP->>R2: GET featured image (from URL)
    R2-->>PP: Image bytes
    PP-->>V: Rendered article page (ISR)
    PP->>API: POST /api/articles/{slug}/view
    API->>DB: UPDATE view_count
```

#### 2.2.2 Login & JWT Refresh Flow

```mermaid
sequenceDiagram
    participant U as User
    participant PP as Public Portal
    participant API as Admin Panel API
    participant DB as PostgreSQL

    U->>PP: Submit email + password
    PP->>API: POST /api/auth/login
    API->>DB: Verify credentials (bcrypt)
    DB-->>API: User (ACTIVE)
    API-->>PP: {accessToken, refreshToken, expiresIn}
    PP->>PP: Store tokens (localStorage)
    PP->>API: GET /api/articles (Bearer token)
    alt Token expired (401)
        PP->>API: POST /api/auth/refresh-token
        API-->>PP: New accessToken
        PP->>API: Retry original request
    end
```

#### 2.2.3 Article Publishing Workflow (Author → Admin)

```mermaid
sequenceDiagram
    participant A as Author
    participant AP as Admin Panel
    participant DB as PostgreSQL
    participant AD as Admin
    participant Sch as Scheduler

    A->>AP: Create article (DRAFT)
    AP->>DB: INSERT articles
    A->>AP: Submit for review
    AP->>DB: UPDATE status = REVIEW
    AD->>AP: Review article
    AD->>AP: Approve
    AP->>DB: UPDATE status = APPROVED
    alt Publish immediately
        AD->>AP: Publish
        AP->>DB: UPDATE status = PUBLISHED
    else Schedule for later
        AD->>AP: Set scheduledAt
        AP->>DB: UPDATE status = SCHEDULED
        Sch->>DB: Poll SCHEDULED & due
        Sch->>DB: UPDATE status = PUBLISHED
    end
```

#### 2.2.4 Comment Moderation Flow

```mermaid
sequenceDiagram
    participant U as Registered User
    participant PP as Public Portal
    participant API as Admin Panel API
    participant DB as PostgreSQL
    participant AD as Admin

    U->>PP: Submit comment on article
    PP->>API: POST /api/comments (Bearer token)
    API->>DB: INSERT comments (status = PENDING)
    AD->>API: GET /api/admin/comments
    AD->>API: PATCH /api/admin/comments/{id}/status
    API->>DB: UPDATE status = APPROVED/REJECTED
    PP->>API: GET /api/articles/{slug}/comments
    API-->>PP: Only APPROVED comments
```

### 2.3 Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ COMMENTS : writes
    USERS ||--o{ BOOKMARKS : saves
    USERS ||--o{ MEDIA : uploads
    USERS ||--o{ AUDIT_LOGS : triggers
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ ADVERTISEMENTS : creates
    USERS ||--o{ POLL_VOTES : casts
    USERS ||--o{ HOROSCOPES : authors

    AUTHORS ||--o{ ARTICLES : writes
    AUTHORS ||--o{ VIDEOS : authors
    AUTHORS ||--o{ AUDIO_NEWS : authors
    AUTHORS ||--o{ PHOTO_GALLERIES : authors

    CATEGORIES ||--o{ ARTICLES : categorizes
    CATEGORIES ||--o{ AUDIO_NEWS : categorizes
    CATEGORIES ||--o{ CATEGORIES : parent_of

    ARTICLES ||--o{ COMMENTS : has
    ARTICLES ||--o{ BOOKMARKS : has
    ARTICLES ||--o{ PAGE_VIEWS : tracks
    ARTICLES ||--o{ ARTICLE_TAGS : tagged_by
    TAGS ||--o{ ARTICLE_TAGS : used_in
    MEDIA ||--o{ ARTICLES : featured_image
    MEDIA ||--o{ PHOTO_GALLERIES : cover_image
    PHOTO_GALLERIES ||--o{ PHOTO_GALLERY_PHOTOS : contains
    MEDIA ||--o{ PHOTO_GALLERY_PHOTOS : used_as

    POLLS ||--o{ POLL_OPTIONS : has
    POLLS ||--o{ POLL_VOTES : receives
    POLL_OPTIONS ||--o{ POLL_VOTES : receives

    USERS {
        string id PK
        string email UK
        string passwordHash
        string name
        string profilePhoto
        string bio
        role role
        userstatus status
        datetime lastLoginAt
        datetime deletedAt
    }
    AUTHORS {
        string id PK
        string name
        string bio
        string image
        string email
        boolean isActive
    }
    CATEGORIES {
        string id PK
        string name
        string slug UK
        string parentId FK
        datetime deletedAt
    }
    TAGS {
        string id PK
        string name
        string slug UK
    }
    ARTICLES {
        string id PK
        string title
        string content
        string excerpt
        string slug UK
        articlestatus status
        boolean isFlashUpdate
        boolean isFeatured
        boolean isTitleOnly
        datetime scheduledAt
        datetime publishedAt
        int viewCount
        string authorId FK
        string categoryId FK
        string subcategoryId FK
        datetime deletedAt
    }
    ARTICLE_TAGS {
        string articleId FK
        string tagId FK
    }
    MEDIA {
        string id PK
        string filename
        string url
        mediatype type
        int size
        string uploadedBy FK
    }
    COMMENTS {
        string id PK
        string content
        commentstatus status
        string articleId FK
        string userId FK
        string parentId FK
        int likesCount
        int reportCount
    }
    BOOKMARKS {
        string id PK
        string userId FK
        string articleId FK
    }
    ADVERTISEMENTS {
        string id PK
        string title
        string mediaUrl
        string position
        boolean isActive
        string createdBy FK
        datetime startDate
        datetime endDate
    }
    POLLS {
        string id PK
        string question
        boolean isActive
        boolean isMultiple
        datetime startsAt
        datetime expiresAt
    }
    POLL_OPTIONS {
        string id PK
        string text
        int order
        string pollId FK
    }
    POLL_VOTES {
        string id PK
        string pollId FK
        string optionId FK
        string userId FK
        string ipAddress
    }
    HOROSCOPES {
        string id PK
        string zodiacSign
        string title
        string content
        date date
        boolean isPublished
        string authorId FK
    }
    AUDIO_NEWS {
        string id PK
        string title
        string audioUrl
        string categoryId FK
        string authorId FK
        boolean isPublished
        int viewCount
    }
    VIDEOS {
        string id PK
        string title
        string youtubeUrl
        string iframeUrl
        string authorId FK
        boolean isPublished
        boolean isLivestream
        boolean isFeaturedLivestream
    }
    PHOTO_GALLERIES {
        string id PK
        string title
        string slug UK
        boolean isPublished
        string authorId FK
        string coverImageId FK
    }
    PHOTO_GALLERY_PHOTOS {
        string id PK
        string photoGalleryId FK
        string mediaId FK
        int order
    }
    SITE_SETTINGS {
        string id PK
        string key UK
        string value
    }
    TEAM_MEMBERS {
        string id PK
        string name
        string department
        string designation
        boolean isActive
    }
    AUDIT_LOGS {
        string id PK
        string userId FK
        string action
        string targetType
        string targetId
        string ipAddress
    }
    NOTIFICATIONS {
        string id PK
        string userId FK
        string type
        string message
        boolean isRead
    }
    PAGE_VIEWS {
        string id PK
        string articleId FK
        string slug
        string ipAddress
        datetime createdAt
    }
```

### 2.4 Data Flow Diagram (DFD) — Level 0 (Context)

```mermaid
flowchart LR
    V([Visitor]) -->|browse/read/search| PP[Public Portal]
    U([Registered User]) -->|login/comment/bookmark/vote| PP
    A([Author/Admin/SuperAdmin]) -->|manage content| AP[Admin Panel]
    AP -->|REST API| PP
    AP -->|queries| DB[(PostgreSQL)]
    AP -->|CRUD| R2[(Cloudflare R2)]
    Sched[Scheduler] -->|poll/publish/summarize| DB
    Ext([External Cron]) -->|GET /api/cron/publish-scheduled| AP
    GA([Google Analytics]) <-->|pageview events| PP
```

#### DFD — Level 1 (Processes)

```mermaid
flowchart LR
    subgraph Process[Core Processes]
        P1[1. Content Management]
        P2[2. Publishing Workflow]
        P3[3. Authentication & Authorization]
        P4[4. Public Content Delivery]
        P5[5. User Interaction]
        P6[6. Analytics & Tracking]
        P7[7. Media Storage]
    end

    D1[(users)]
    D2[(articles)]
    D3[(categories/tags)]
    D4[(comments/bookmarks)]
    D5[(polls/votes)]
    D6[(ads)]
    D7[(media)]
    D8[(audit_logs)]

    P1 --> D2
    P1 --> D3
    P2 --> D2
    P3 --> D1
    P4 --> D2
    P4 --> D3
    P5 --> D4
    P5 --> D5
    P6 --> D8
    P7 --> D7
```

---

## 3. Database Design Documents

### 3.1 Database Schema

- **Database engine:** PostgreSQL (managed via **Neon** in production)
- **ORM:** Prisma 5.x
- **Schema source:** `admin_panel/prisma/schema.prisma`
- **Migrations:** `admin_panel/prisma/migrations/` (managed with `prisma migrate`)

#### Entity Summary

| Table (map name) | Model | Description |
|------------------|-------|-------------|
| `users` | `User` | System users; roles: `PUBLIC_USER`, `AUTHOR`, `ADMIN`, `SUPERADMIN`; statuses: `PENDING`, `ACTIVE`, `SUSPENDED`, `BANNED`; soft-deletable (`deletedAt`) |
| `authors` | `Author` | Article authors (byline entities, separate from login accounts) |
| `categories` | `Category` | Hierarchical categories with `parentId` self-relation; soft-deletable |
| `tags` | `Tag` | Content tags |
| `articles` | `Article` | Bilingual articles with status workflow `DRAFT → REVIEW → APPROVED → PUBLISHED / SCHEDULED / ARCHIVED`; flags for flash update, featured, title-only; soft-deletable |
| `article_tags` | `ArticleTag` | Join table `Article ↔ Tag` (composite PK) |
| `media` | `Media` | Uploaded files (IMAGE / VIDEO / DOCUMENT) stored on R2 |
| `comments` | `Comment` | User comments with moderation status; threaded via `parentId`; soft-deletable |
| `bookmarks` | `Bookmark` | User article bookmarks (unique on `[userId, articleId]`) |
| `advertisements` | `Advertisement` | Ads by placement position (SIDEBAR, BANNER, IN_ARTICLE, etc.); active flags and date windows |
| `polls` | `Poll` | Polls with options and votes |
| `poll_options` | `PollOption` | Poll answer options |
| `poll_votes` | `PollVote` | Poll votes (unique on `[pollId, userId]`, anonymous via `ipAddress`) |
| `horoscopes` | `Horoscope` | Daily horoscope content by zodiac sign |
| `audio_news` | `AudioNews` | Audio news clips with playback URL |
| `videos` | `Video` | Video news incl. livestream and featured livestream flags |
| `photo_galleries` | `PhotoGallery` | Photo gallery collection |
| `photo_gallery_photos` | `PhotoGalleryPhoto` | Join table `PhotoGallery ↔ Media` with ordering |
| `site_settings` | `SiteSetting` | Key/value site configuration |
| `team_members` | `TeamMember` | Public team/editorial staff directory |
| `audit_logs` | `AuditLog` | Audit trail of system actions |
| `notifications` | `Notification` | Per-user notifications |
| `page_views` | `PageView` | Per-article view tracking rows |

#### Enums

| Enum | Values |
|------|--------|
| `Role` | `PUBLIC_USER`, `AUTHOR`, `ADMIN`, `SUPERADMIN` |
| `UserStatus` | `PENDING`, `ACTIVE`, `SUSPENDED`, `BANNED` |
| `ArticleStatus` | `DRAFT`, `REVIEW`, `APPROVED`, `PUBLISHED`, `ARCHIVED`, `SCHEDULED` |
| `MediaType` | `IMAGE`, `VIDEO`, `DOCUMENT` |
| `AdStatus` | `ACTIVE`, `INACTIVE`, `SCHEDULED` |
| `CommentStatus` | `PENDING`, `APPROVED`, `REJECTED`, `SPAM` |

#### Key Indexing Strategy

- Composite indexes on `articles`: `[status, deletedAt, publishedAt]`, `[status, deletedAt, authorId]`, plus individual indexes on `status`, `publishedAt`, `authorId`, `categoryId`, `subcategoryId`, `isFlashUpdate`, `isFeatured`, `isTitleOnly`.
- Unique constraints: `users.email`, `categories.slug`, `tags.slug`, `articles.slug`, `site_settings.key`, `photo_galleries.slug`, `bookmarks [userId, articleId]`, `poll_votes [pollId, userId]`, `photo_gallery_photos [photoGalleryId, mediaId]`.

### 3.2 Stored Procedure Documentation

**No stored procedures are used in this system.**

All database access is performed through the **Prisma ORM** at the application layer. There are no `CREATE PROCEDURE` / `CREATE FUNCTION` definitions in the codebase. Business logic (publishing scheduled articles, generating AI summaries, view-count increment) is implemented in application code:

| Concern | Location |
|---------|----------|
| Scheduled article publishing | `admin_panel/scheduler/index.js` (`publishScheduledArticles`) |
| AI article summary generation | `admin_panel/scheduler/index.js` (`generateAISummaries` via OpenRouter) |
| View count increments | `admin_panel/app/api/articles/[slug]/view/route.ts` |
| Data seeding | `admin_panel/prisma/seed.ts`, `admin_panel/scripts/seed-ads.ts` |

> If the Lightweb team requires database-level procedures in the future, they should be created as Prisma migrations and documented here.

### 3.3 Triggers Documentation

**No database triggers are used in this system.**

There are no `CREATE TRIGGER` statements in the migrations. The equivalent application-level behaviors are:

| Behavior | Application Equivalent |
|----------|------------------------|
| `updatedAt` maintenance | Prisma `@updatedAt` field attribute |
| Cascading deletes (comments, bookmarks, poll options/votes, gallery photos, article_tags) | Prisma `onDelete: Cascade` relation actions |
| Soft-delete filtering | Manual `deletedAt IS NULL` conditions in queries |
| View count increment | Application logic in `view/route.ts` |

### 3.4 Views Documentation

**No database views are used in this system.**

Analytics and aggregate data are computed on demand by the application. Key queries producing view-like outputs:

| Logical View | Computed By |
|--------------|-------------|
| Public category listing with child counts | `GET /api/categories` (Prisma `_count`) |
| Top/popular articles | `GET /api/articles/popular` |
| Analytics overview & top articles/authors | `GET /api/admin/analytics` |
| Published article feed with pagination | `GET /api/articles` |

---

## 4. Technical Details

### 4.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| Admin Panel / API | Next.js 16 (App Router), React 19, TypeScript |
| Public Portal | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS 3.x + shadcn/ui (Radix primitives) |
| Database | PostgreSQL (Prisma ORM 5.x) |
| Object storage | Cloudflare R2 (S3-compatible, via `@aws-sdk/client-s3`) |
| Auth | NextAuth.js 4 (credentials), JWT access + refresh tokens (jsonwebtoken) |
| Validation | Zod + react-hook-form |
| Data fetching (client) | TanStack Query 5 |
| Rich text editing | TipTap |
| Charts | Recharts |
| Notifications/toasts | Sonner |
| Emails | Nodemailer (SMTP) |
| Scheduler | Standalone Node.js process (`node scheduler/index.js`) |
| Containerization | Docker + Docker Compose |
| Runtime images | Node 20 Alpine (`node:20-alpine`) |

### 4.2 Programming Languages

- **TypeScript** — primary language for both applications (`strict` mode).
- **JavaScript (Node.js)** — scheduler process (`scheduler/index.js`), Prisma seed & utility scripts.
- **SQL** — via Prisma migrations (`prisma/migrations/*/migration.sql`).
- **CSS** — Tailwind CSS directives and global styles.
- **Markdown / JSON / YAML** — configuration and documentation.

### 4.3 Technologies

| Technology | Purpose | Where |
|-----------|---------|-------|
| Next.js | Full-stack React framework (App Router, API Routes, SSR/ISR, standalone output) | both apps |
| NextAuth.js | Session/credentials auth with Prisma adapter | admin_panel |
| JWT | Stateless access + refresh tokens | admin_panel `lib/jwt.ts` |
| Prisma | Type-safe ORM, migrations, client generation | admin_panel |
| PostgreSQL (Neon) | Relational database | managed, production |
| Cloudflare R2 | S3-compatible media object storage | admin_panel `lib/storage.ts` |
| AWS SDK v3 | S3 client for R2 operations | admin_panel |
| Docker / Compose | Containerization and orchestration | repo root |
| TanStack Query | Client state/server cache | both apps |
| NextAuth middleware + custom `middleware.ts` | Route protection, CORS preflight, role checks | admin_panel |
| swagger-jsdoc / swagger-ui-dist | Auto-generated OpenAPI docs at `/api-docs` | admin_panel |
| next-sitemap | Sitemap + robots.txt generation | public_portal |
| next-themes | Dark mode | public_portal |
| Framer Motion | Animations | public_portal |
| embla-carousel-react | Carousels | public_portal |
| Bikram Sambat libraries | Nepali date conversion | public_portal |
| OpenRouter API | AI-generated article summaries | scheduler |
| bcryptjs | Password hashing (12 rounds) | admin_panel |
| LRU-Cache | In-memory API cache + rate-limit counters | admin_panel `lib/redis.ts` |
| multer | File upload handling | admin_panel |

### 4.4 Dependencies Documentation

#### Admin Panel (`admin_panel/package.json`) — key runtime dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^16.0.0 | Framework |
| `react` / `react-dom` | ^19.0.0 | UI runtime |
| `@prisma/client` | ^5.6.0 | ORM client |
| `next-auth` | ^4.24.5 | Authentication |
| `jsonwebtoken` | ^9.0.3 | JWT issuance/verification |
| `bcryptjs` | ^2.4.3 | Password hashing |
| `@tanstack/react-query` | ^5.8.4 | Server-state management |
| `@aws-sdk/client-s3` | ^3.1031.0 | R2 object storage |
| `swagger-jsdoc` / `swagger-ui-dist` | ^6.2.8 / ^5.32.1 | API documentation |
| `nodemailer` | ^7.0.13 | Email sending |
| `multer` | ^1.4.5-lts.2 | File uploads |
| `zod` | ^3.22.4 | Schema validation |
| `react-hook-form` | ^7.48.2 | Forms |
| `@tiptap/react` + extensions | ^2.1.12 | Rich text editor |
| `recharts` | ^2.10.3 | Analytics charts |
| `sonner` | ^1.2.4 | Toasts |
| `transliteration` | ^2.6.1 | Slug generation |
| `lru-cache` | ^11.3.2 | Caching |
| `uuid` | ^9.0.1 | ID generation |
| `lucide-react` | ^1.7.0 | Icons |

#### Public Portal (`public_portal/package.json`) — key runtime dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.2.5 | Framework |
| `react` / `react-dom` | ^18.3.1 | UI runtime |
| `@tanstack/react-query` | ^5.0.0 | Server-state management |
| `next-sitemap` | ^4.0.0 | Sitemaps |
| `next-themes` | ^0.3.0 | Dark mode |
| `framer-motion` | ^11.0.0 | Animations |
| `embla-carousel-react` | ^8.6.0 | Carousels |
| `bikram-sambat` / `nepali-date-library` | ^1.0.0 / ^1.1.14 | Nepali calendar |
| `isomorphic-dompurify` | ^3.6.0 | HTML sanitization |
| `schema-dts` | ^1.1.0 | JSON-LD typing |
| `sharp` | ^0.34.5 | Image optimization |
| `vaul` | ^1.1.2 | Drawer/dialog |
| Radix UI primitives + shadcn/ui | — | UI component library |

> **Installation note:** install dependencies with `npm ci` (CI-friendly, uses lockfiles `package-lock.json`). Node.js 20+ required.

---

## 5. API Documentation

### 5.1 API Documentation

The system exposes **interactive Swagger/OpenAPI documentation** generated from JSDoc annotations.

- **Swagger UI:** `GET /api-docs` (served by the admin panel, port 3000)
- **OpenAPI JSON:** `GET /api-docs/json`
- **Source:** `admin_panel/lib/swagger.ts`

Public consumers can also reference the frontend integration guide: `admin_panel/docs/frontend-integration-guide.md` and authentication guide: `admin_panel/docs/authentication-guide.md`.

**Response envelope (all endpoints):**
```json
{
  "success": true,
  "data": { "...": "..." },
  "message": "Human-readable message"
}
```

**Authentication:**
```
Authorization: Bearer <accessToken>
```
Access tokens expire in 15 minutes; refresh tokens in 7 days. Use `POST /api/auth/refresh-token` to rotate.

### 5.2 API Catalogue

> Base URL (production): `https://<admin-api-domain>` — see [Section 6.3](#63-mapped-subdomains). Development: `http://localhost:3000`.

#### Public Endpoints (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List published articles (pagination, category, tag, search, flash-update filters) |
| GET | `/api/articles/popular` | Most-viewed published articles |
| GET | `/api/articles/:slug` | Single published article detail (cached 10 min) |
| POST | `/api/articles/:slug/view` | Increment article view count |
| GET | `/api/articles/:slug/comments` | Approved comments for an article |
| GET | `/api/categories` | Public category tree with article counts (cached 1 hr) |
| GET | `/api/ads?position=...` | Active ads, optionally by position (cached 5 min) |
| GET | `/api/ads/random?position=...` | Random ad for a position |
| POST | `/api/ads/:id/click` | Record ad click |
| GET | `/api/polls` | Active polls with options (cached 5 min) |
| GET | `/api/polls/:id` | Single poll |
| POST | `/api/polls/:id/vote` | Cast a vote (one per user) |
| GET | `/api/polls/:id/results` | Poll results/statistics |
| GET | `/api/horoscopes` | Published horoscopes (filter by `zodiacSign`, paginated) |
| GET | `/api/horoscopes/:id` | Single horoscope |
| GET | `/api/videos` | Published videos (search, livestream filters) |
| GET | `/api/videos?isFeaturedLivestream=true` | Featured livestream |
| GET | `/api/audio-news` | Published audio news (pagination, category, search) |
| GET | `/api/audio-news/:id` | Single audio news item |
| GET | `/api/photo-galleries` | Published photo galleries |
| GET | `/api/photo-galleries/:slug` | Single photo gallery by slug |
| GET | `/api/team-members` | Active team members (pagination) |
| GET | `/api/settings/contact` | Contact info (email/phone/address) |
| GET | `/api/settings/social` | Social media URLs |

#### Authentication & User Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a public user |
| POST | `/api/auth/login` | Public | Login (returns access + refresh tokens) |
| POST | `/api/auth/logout` | Auth | Logout / invalidate session |
| POST | `/api/auth/refresh-token` | Public | Rotate access token |
| POST | `/api/auth/forgot-password` | Public | Request password reset |
| POST | `/api/auth/reset-password` | Public | Reset password with token |
| POST | `/api/auth/invite` | Admin+ | Invite staff user |
| GET | `/api/auth/me` | Auth | Current user profile |
| PATCH | `/api/auth/profile` | Auth | Update profile |
| POST | `/api/auth/change-password` | Auth | Change password |
| GET | `/api/users` | Admin+ | List users |
| GET | `/api/users/:id` | Admin+ | User detail |
| GET | `/api/users/:id/activity` | Admin+ | User activity |
| PATCH | `/api/users/:id` | SuperAdmin | Update user |
| DELETE | `/api/users/:id` | SuperAdmin | Delete user |
| GET/PATCH | `/api/users/me` | Auth | Own profile |

#### Comments & Bookmarks

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/comments` | Public | Approved comments |
| POST | `/api/comments` | Auth | Create comment (rate-limited) |
| POST | `/api/comments/:id/like` | Auth | Like comment |
| POST | `/api/comments/:id/report` | Auth | Report comment |
| DELETE | `/api/comments/:id` | Auth (owner) | Delete own comment |
| GET/POST/DELETE | `/api/bookmarks` | Auth | List/create/delete bookmarks |

#### Admin Endpoints (`/api/admin/*`) — role protected

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/articles` | Author+ | List all articles |
| POST | `/api/admin/articles` | Author+ | Create article |
| GET | `/api/admin/articles/:id` | Author+ | Get article |
| PATCH | `/api/admin/articles/:id` | Author+ | Update article |
| DELETE | `/api/admin/articles/:id` | Admin+ | Delete article |
| PATCH | `/api/admin/articles/:id/publish` | Admin+ | Publish |
| PATCH | `/api/admin/articles/:id/unpublish` | Admin+ | Unpublish |
| PATCH | `/api/admin/articles/:id/approve` | Admin+ | Approve |
| PATCH | `/api/admin/articles/:id/reject` | Admin+ | Reject |
| PATCH | `/api/admin/articles/:id/featured` | Admin+ | Toggle featured |
| PATCH | `/api/admin/articles/:id/schedule` | Admin+ | Schedule publish |
| PATCH | `/api/admin/articles/:id/submit-review` | Author+ | Submit for review |
| CRUD | `/api/admin/categories`, `/api/admin/tags` | Admin+ | Manage categories/tags |
| CRUD | `/api/admin/ads`, `/api/admin/polls`, `/api/admin/horoscopes` | Admin+ | Manage ads/polls/horoscopes |
| CRUD | `/api/admin/videos`, `/api/admin/audio-news`, `/api/admin/photo-galleries` | Admin+ | Manage multimedia |
| CRUD | `/api/admin/authors`, `/api/admin/team-members` | Admin+ | Manage authors/team |
| GET | `/api/admin/comments` | Admin+ | List all comments |
| PATCH | `/api/admin/comments/:id/status` | Admin+ | Moderate comment |
| GET | `/api/admin/analytics?type=overview|articles|authors` | Admin+ | Analytics |
| GET | `/api/admin/audit-logs` | SuperAdmin | Audit trail |
| GET/PATCH | `/api/admin/settings` | SuperAdmin | Site settings |
| POST | `/api/admin/cache/clear` | SuperAdmin | Clear API cache |

#### System / Cron

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cron/publish-scheduled?secret=...` | Publish due scheduled articles (guarded by `CRON_SECRET` in production) |
| GET | `/uploads/:path*` | Served uploaded files (rewritten by public portal to admin panel) |

> **Note on secrets:** The repository's `.env.production` files must **not** be committed to a public repository. Credentials for the Neon database, Cloudflare R2, OpenRouter, SMTP and NextAuth must be distributed out-of-band during handover.

---

## 6. System Server Details

> ⚠️ **Action required during handover:** The values below reflect the architecture and the external services configured in the code. Live hostnames/IPs must be confirmed and filled in by the outgoing (HTC Media) and incoming (Lightweb Group) infrastructure teams.

### 6.1 Hosted Servers

| Service | Provider | Host / Service | Purpose |
|---------|----------|----------------|---------|
| Application server (VPS) | aaPanel (Linux VPS) | VPS hosting `admin_panel`, `public_portal`, `scheduler` containers | Docker Compose runtime |
| PostgreSQL database | Neon (serverless Postgres) | `ep-shiny-shadow-*.aws.neon.tech` (region `us-east-1`) | Primary database (pooled connection) |
| Object storage (media) | Cloudflare R2 | Bucket `hitec-media-news` | Images, videos, documents |
| CDN / public media URL | Cloudflare | `pub-*.r2.dev` public bucket URL | Media delivery to browsers |
| AI summarization | OpenRouter | `openrouter.ai/api/v1/chat/completions` | Scheduler-generated summaries |
| Email (optional) | SMTP provider | Configured via `SMTP_*` env vars | Password reset, notifications |
| Analytics | Google Analytics 4 | `NEXT_PUBLIC_GA_ID` | Visitor analytics on public portal |

### 6.2 IP Addresses

| Host | IP Address | Notes |
|------|-----------|-------|
| VPS application server | `TBD — confirm with HTC Media` | Firewall must allow ports 3000/3001 (or reverse-proxy 80/443) and outbound 5432 |
| Neon PostgreSQL host | Resolved from `DATABASE_URL` (see 6.1) | Connection is TLS-required |
| Cloudflare R2 endpoint | Resolved from `R2_ENDPOINT` | S3 API endpoint |

**Ports in use (internal):**

| Port | Service |
|------|---------|
| 3000 | Admin panel / API (container `admin_panel`) |
| 3001 | Public portal (container `public_portal`) |
| 5432 | PostgreSQL (external, Neon) — not exposed locally |

### 6.3 Mapped Subdomains

| Subdomain | Target | Notes |
|-----------|--------|-------|
| `https://<www-domain>` (public portal) | Public Portal container :3001 | Primary site; SEO/sitemaps use `NEXT_PUBLIC_SITE_URL` |
| `https://<admin-domain>` (admin panel) | Admin Panel container :3000 | Login at `/login`, admin at `/admin` |
| API base URL | Admin Panel :3000 | Consumed as `NEXT_PUBLIC_API_URL` / `API_URL` |
| Media CDN | Cloudflare R2 public URL | Referenced as `R2_PUBLIC_URL` |

**A typical reverse-proxy (Nginx on aaPanel) layout:**

```nginx
# Public portal
server {
    listen 443 ssl;
    server_name htcmedia.com.np;
    # ssl_certificate / ssl_certificate_key ...
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Admin panel / API
server {
    listen 443 ssl;
    server_name admin.hitecmedianews.com;
    # ssl_certificate / ssl_certificate_key ...
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

## 7. Deployment Guide, Architecture and Configurations

### 7.1 Deployment Guide

#### Prerequisites
- Docker + Docker Compose on the target VPS (aaPanel recommended per README).
- Node.js 20+ for local builds/tooling.
- PostgreSQL reachable from the VPS (Neon in production).
- Cloudflare R2 credentials.

#### Step 1 — Clone & prepare environment
```bash
git clone https://github.com/Ash-333/news-portal.git
cd news-portal
```

#### Step 2 — Configure production environment files

`admin_panel/.env.production` (example — use real values during handover):
```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/neondb?sslmode=require&channel_binding=require
NEXTAUTH_URL=https://admin.hitecmedianews.com/
NEXTAUTH_SECRET=<long-random-secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=12
APP_NAME=HTC Media
APP_URL=https://htcmedia.com.np/
CORS_ALLOWED_ORIGIN=https://htcmedia.com.np/
CRON_SECRET=<random-secret-for-cron>
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=HTC Media <noreply@htcmedia.com.np>
RATE_LIMIT_LOGIN=5
RATE_LIMIT_LOGIN_WINDOW=900
RATE_LIMIT_COMMENTS=5
RATE_LIMIT_COMMENTS_WINDOW=3600
RATE_LIMIT_API=100
RATE_LIMIT_API_WINDOW=60
UPLOAD_PATH=/app/public
OPENROUTER_API_KEY=<openrouter-key>
R2_ENDPOINT=https://<account>.r2.cloudflarestorage.com/hitec-media-news
R2_PUBLIC_URL=https://<public-hostname>.r2.dev/hitec-media-news
R2_ACCESS_KEY_ID=<access-key>
R2_SECRET_ACCESS_KEY=<secret-key>
R2_BUCKET_NAME=hitec-media-news
```

`public_portal/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://admin.hitecmedianews.com/
API_URL=http://admin_panel:3000
NEXT_PUBLIC_SITE_URL=https://htcmedia.com.np/
NEXT_PUBLIC_API_HOSTNAME=admin.hitecmedianews.com
NEXT_PUBLIC_GA_ID=<ga4-id>
NEXT_PUBLIC_GOOGLE_VERIFICATION=<verification-code>
NEXT_PUBLIC_YOUTUBE_CHANNEL_URL=https://www.youtube.com/@channel
```

#### Step 3 — Build & start containers
```bash
docker compose up -d --build
```

This starts three services (`admin_panel` :3000, `public_portal` :3001, `scheduler`). The admin panel's `uploads` folder is persisted via a bind mount (`./admin_panel/uploads`).

#### Step 4 — Run database migrations (schema changes)
```bash
docker compose exec admin_panel npx prisma migrate deploy
```

Seed sample data once (optional):
```bash
docker compose exec admin_panel npx prisma db seed
docker compose exec admin_panel npx tsx -r dotenv/config scripts/seed-ads.ts
```

#### Step 5 — Configure reverse proxy & SSL
- Point `htcmedia.com.np` → port 3001 and `admin.hitecmedianews.com` → port 3000.
- Issue/renew TLS certificates (see [Section 11.1](#111-ssl-certificate)).

#### Step 6 — Verify
- Public site: `https://htcmedia.com.np/` (homepage, article, category, search).
- Admin login: `https://admin.hitecmedianews.com/login` → `/admin`.
- Swagger: `https://admin.hitecmedianews.com/api-docs`.
- Sitemaps: `/sitemap.xml`, `/sitemap-news.xml`, `/sitemap-images.xml`.

#### Step 7 — Operations
- View logs: `docker compose logs -f admin_panel public_portal scheduler`
- Restart: `docker compose restart`
- Rebuild after code change: `docker compose up -d --build`

### 7.2 Deployment Architecture

```mermaid
flowchart TB
    subgraph Internet
        DNS[DNS / A records]
        LB[aaPanel Nginx reverse proxy :443]
    end

    subgraph VPS[Docker Host — aaPanel VPS]
        AP[Container: admin_panel :3000<br/>Next.js 16 standalone]
        PP[Container: public_portal :3001<br/>Next.js 14 standalone]
        SC[Container: scheduler<br/>node scheduler/index.js]
        VOL[(./admin_panel/uploads<br/>bind mount)]
        AP --> VOL
        PP -->|API_URL http://admin_panel:3000| AP
    end

    DB[(Neon PostgreSQL<br/>us-east-1)]
    R2[(Cloudflare R2<br/>hitec-media-news)]

    AP --> DB
    SC --> DB
    AP --> R2
    PP -->|browser loads media| R2

    DNS --> LB
    LB --> PP
    LB --> AP
```

- **Multi-stage Docker builds** produce standalone Next.js output (`output: "standalone"`) for both apps, giving small, self-contained runtime images.
- Containers use `restart: unless-stopped` / `always` and read configuration exclusively from `env_file`.
- The `scheduler` shares the admin panel image and runs `npm run scheduler`.

### 7.3 Deployment Configurations

| Config | Value / File |
|--------|--------------|
| Orchestration | `docker-compose.yml` (repo root) |
| Admin image | `admin_panel/Dockerfile` — multi-stage, `node:20-alpine`, standalone output, port 3000 |
| Public image | `public_portal/Dockerfile` — multi-stage, `node:20-alpine`, standalone output, port 3001 |
| Next.js output mode | `output: "standalone"` (both `next.config.js`) |
| Image handling | Admin: `images.unoptimized: true`; Public: AVIF/WebP formats + remotePatterns for R2 |
| CORS | Admin allows `CORS_ALLOWED_ORIGIN` on `/api/*` |
| Uploads persistence | Bind mount `./admin_panel/uploads:/app/public/uploads:rw` |
| Cache-Control | Public portal sets `public, max-age=86400, stale-while-revalidate=604800` for `/uploads/*` |
| Security headers | `X-DNS-Prefetch-Control`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` (public portal middleware + next.config headers) |
| Health/readiness | Not currently defined; rely on `docker compose` restart policy |

---

## 8. DevOps Details with Configurations

### DevOps Technology Used

| Area | Tool | Configuration |
|------|------|---------------|
| Containerization | Docker | Multi-stage `Dockerfile`s per app; `node:20-alpine` base with `libc6-compat` + `openssl` |
| Orchestration | Docker Compose | `docker-compose.yml` — 3 services (`admin_panel`, `public_portal`, `scheduler`) |
| CI/CD | **Not currently configured** | No GitHub Actions / external CI pipeline exists in the repo. Recommended as a handover improvement (see below). |
| Version control | Git + GitHub | Remote: `https://github.com/Ash-333/news-portal.git` (branch `main`) |
| Database migrations | Prisma Migrate | `npx prisma migrate deploy` in production; `prisma migrate dev` in development |
| Secrets management | `.env.production` + `env_file` | Secrets are loaded at container start; must be rotated/redistributed at handover |
| Hosting panel | aaPanel | Reverse proxy + SSL + file manager on VPS |
| Database | Neon (serverless PostgreSQL) | Pooled connection string; TLS required |
| Object storage | Cloudflare R2 | S3-compatible API via `@aws-sdk/client-s3` |
| Scheduler | Node.js `setInterval` process | Runs in dedicated `scheduler` container; `CRON_SECRET` guards the HTTP cron fallback |
| Monitoring/alerting | **Not currently configured** | No external monitoring; recommended to add uptime + error tracking |
| Logging | Docker `docker compose logs` | Console logs (JSON-in-text) from Next.js and scheduler |

### Recommended DevOps Setup (Handover Improvement)

```yaml
# .github/workflows/deploy.yml (suggested)
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SSH deploy to VPS
        run: |
          ssh deploy@your-vps "cd /srv/news-portal && git pull && docker compose up -d --build && docker compose exec admin_panel npx prisma migrate deploy"
```

---

## 9. Code Repository

| Item | Value |
|------|-------|
| Repository URL | `https://github.com/Ash-333/news-portal.git` |
| Remote name | `origin` |
| Default branch | `main` |
| Access | GitHub account of HTC Media (transfer to Lightweb Group or grant maintainer access) |

### Repository Layout

```
news-portal/
├── admin_panel/            # Admin panel + public API (Next.js 16, TypeScript)
│   ├── app/                # App Router pages, (admin) routes, /api routes
│   ├── components/         # admin, ui (shadcn), public components
│   ├── hooks/              # TanStack Query hooks (use-articles, use-ads, ...)
│   ├── lib/                # prisma, auth, jwt, redis(cache), storage(R2), swagger,
│   │   │                   #   email, permissions, middleware, validations
│   ├── prisma/             # schema.prisma + migrations + seed.ts
│   ├── scheduler/          # Background jobs (index.js)
│   ├── scripts/            # seed-ads.ts, migrate-authors.js
│   ├── docs/               # authentication-guide.md, frontend-integration-guide.md
│   ├── Dockerfile
│   └── package.json
├── public_portal/          # Public news website (Next.js 14, TypeScript)
│   ├── src/app/            # article, category, author, tag, search, photos,
│   │   │                   #   videos, audio, polls, sitemaps, etc.
│   ├── src/components/     # layout, sections, article, ads, polls, ui (shadcn)
│   ├── src/lib/api/        # API clients (articles, auth, comments, polls, ...)
│   ├── src/hooks/          # useArticles, useComments, usePolls, ...
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # 3-service orchestration
├── ad-guide.md             # Ad placement guide
├── mobile-app-guide.md     # React Native mobile app requirements (future)
└── docs.md                 # THIS handover document
```

### Branching & Release Practice (recommended)
- Keep `main` as the deployable branch.
- Use feature branches + Pull Requests for changes.
- Tag releases (`git tag v1.0.0`) for auditability.

---

## 10. SOP for Users and Training Materials

### 10.1 User Manual (Public Site Users)

#### 10.1.1 Browsing the Site
1. Open the public website (`https://htcmedia.com.np/`).
2. Use the **header navigation** to browse categories (Politics, Economy, Sports, World, Opinion, etc.).
3. Scroll the **homepage** for featured articles, latest news, flash updates (breaking news ticker), polls, horoscopes, and video/livestream sections.
4. Use **search** (top bar or search page) to find articles by keyword.

#### 10.1.2 Reading an Article
1. Click any article card/title to open the article detail page.
2. The article shows title, subheading, author, publish date, and body content in the selected language.
3. Use **Share** buttons to share on social media.
4. **Related articles** and **popular articles** appear below/sidebar for further reading.

#### 10.1.3 Language Switching (Nepali / English)
1. Use the language toggle in the header to switch the whole site between Nepali (नेपाली) and English.
2. Content, dates, and labels update accordingly.

#### 10.1.4 Register & Login
1. Click **Login/Register** in the header.
2. **Register:** enter name, email, and password; verify your email (if enabled).
3. **Login:** enter email and password; the session persists across visits.
4. Use **Forgot password** to reset via email link.

#### 10.1.5 Interactive Features (Registered Users)
- **Comment:** scroll to the comment section on an article, type and submit (comments appear after admin approval).
- **Like comments:** click the like icon on approved comments.
- **Bookmark:** click the bookmark icon on articles to save them; manage them under **Bookmarks**.
- **Vote in polls:** select an option and submit — one vote per user per poll; results are shown after voting.
- **Dark mode:** toggle dark/light theme from the header (if enabled).

#### 10.1.6 Multimedia
- **Videos/Livestreams:** watch from the Videos page; featured livestreams may auto-embed YouTube.
- **Audio news:** play audio clips with the built-in player.
- **Photo galleries:** browse galleries and full-screen photos.
- **Horoscopes:** view daily horoscopes for your zodiac sign.

### 10.2 Admin Manual (Authors, Admins, SuperAdmins)

Access: `https://admin.hitecmedianews.com/login` → admin dashboard at `/admin`.

#### 10.2.1 Roles & Permissions
| Role | Capabilities |
|------|--------------|
| **Public User** | Read, comment, bookmark, vote |
| **Author** | Create/edit articles, submit for review |
| **Admin** | Publish/unpublish/schedule, approve/reject, manage categories, tags, media, ads, polls, horoscopes, videos, audio news, galleries, comments moderation, analytics |
| **SuperAdmin** | Everything in Admin + user management, roles, audit logs, site settings, cache clear |

#### 10.2.2 Managing Articles
1. **Create:** Admin panel → Articles → *New Article*. Fill title (Nepali + English where applicable), slug (auto-generated via transliteration), excerpt, content (TipTap rich editor), category/subcategory, featured image, tags, meta title/description, and flags (Flash Update, Featured, Title-only).
2. **Workflow:**
   - Author saves as **Draft**, then **Submit for Review**.
   - Admin reviews, then **Approve** or **Reject** (with feedback).
   - Approved articles can be **Published** immediately, **Scheduled**, or kept **Unpublished**.
3. **Edit/Publish:** use the article list actions (edit, publish, unpublish, schedule, featured toggle).
4. **Delete:** soft-deletes the article (removable only by Admin+).

#### 10.2.3 Managing Categories & Tags
- Admin panel → Categories: create hierarchical categories (parent/child), set names and slugs.
- Admin panel → Tags: create and assign tags to articles.

#### 10.2.4 Media Manager
- Admin panel → Media: upload images/videos/documents (stored to Cloudflare R2).
- Allowed: JPG, PNG, GIF, WEBP, SVG (images); MP4, WebM, OGG (video); PDF, DOC/DOCX, TXT (documents). Max sizes: 10 MB images/docs, 100 MB video.
- Reference uploaded media from article forms (featured image, in-content images).

#### 10.2.5 Ads Management
See `ad-guide.md` in the repository for full details. Key points:
- Admin panel → Ads → Create Ad (title EN/NE, click URL, position, image/GIF or script).
- Toggle active/inactive; schedule start/end dates.
- Positions: `SIDEBAR`, `BANNER`, `IN_ARTICLE`, `SIDEBAR_TOP`, `SIDEBAR_BOTTOM`, `HOME_MIDDLE`, `HOME_TOP`, `TOP_BAR`, `ARTICLE_DETAIL`, `ARTICLE_TITLE`, `ARTICLE_EXCERPT`, `ARTICLE_END`, `FEATURED_1..3`, `LATEST_NEWS`, `CATEGORY_SECTION`, `SECTION_SIDEBAR`.
- Recommended sizes: 728×90 (banners), 300×250 (sidebars).

#### 10.2.6 Comments Moderation
- Admin panel → Comments: view all comments with status (`PENDING`, `APPROVED`, `REJECTED`, `SPAM`).
- Approve, reject, or delete as appropriate.

#### 10.2.7 Polls, Horoscopes, Videos, Audio News, Photo Galleries
Each has a dedicated admin section:
- **Polls:** create question, options, active window, single/multiple choice; view results.
- **Horoscopes:** set zodiac sign, icon, title/content per day, publish.
- **Videos:** embed YouTube URL/iframe, thumbnail, livestream + featured livestream flags, publish.
- **Audio news:** upload audio URL, title/description, category, publish.
- **Photo galleries:** title, slug, cover image, add photos with order/captions, publish.

#### 10.2.8 Team Members & Authors
- **Team Members:** manage the public "Our Team" directory (name, department, designation, image, bio, contact, socials, display order).
- **Authors:** manage bylines (name, bio, image, email) used by articles/videos/audio/galleries.

#### 10.2.9 Users & Roles (SuperAdmin)
- Admin panel → Users: invite/register staff, list users, view activity, change roles (`AUTHOR`, `ADMIN`, `SUPERADMIN`), suspend/ban, delete.

#### 10.2.10 Analytics (Admin+)
- Dashboard + Analytics: overview stats, charts (Recharts), top articles, author performance.

#### 10.2.11 Site Settings & Cache (SuperAdmin)
- Settings: site-wide configuration (contact info, social links, branding).
- Cache: clear the API cache from `/api/admin/cache/clear` after bulk changes.

#### 10.2.12 Audit Logs (SuperAdmin)
- Audit Logs: view all tracked actions (who did what, when, from where).

### 10.3 Training Materials

#### Onboarding Checklist for New Staff
1. [ ] Read the [User Manual](#101-user-manual-public-site-users) and [Admin Manual](#102-admin-manual-authors-admins-superadmins).
2. [ ] Create a login and confirm email.
3. [ ] Walk through the article create → review → publish workflow once with a mentor.
4. [ ] Review the [Ad Placement Guide](ad-guide.md).
5. [ ] Review the [Authentication Guide](admin_panel/docs/authentication-guide.md) and [Frontend Integration Guide](admin_panel/docs/frontend-integration-guide.md) (developers).
6. [ ] Practice moderation, media upload, and scheduled publishing in a staging environment.

#### Developer Onboarding
- Stack walkthrough: Next.js App Router, TypeScript, Prisma, TanStack Query, Tailwind/shadcn.
- Run locally: `npm install` → `.env` setup → `npx prisma migrate dev` → `npm run dev` (admin :3000, public :3001).
- API exploration: Swagger UI at `/api-docs`.
- Deployment: follow [Section 7](#7-deployment-guide-architecture-and-configurations).

#### Standard Operating Procedures (SOP)
| # | Scenario | Procedure |
|---|----------|-----------|
| 1 | Publish a breaking news item | Create article → flag **Flash Update** → Admin approve → Publish immediately. Verify ticker on homepage. |
| 2 | Schedule a future article | Create → Approve → Schedule with `scheduledAt` (NPT). Scheduler auto-publishes. |
| 3 | Replace a broken media image | Re-upload in Media Manager → update article featured image. |
| 4 | Take down a wrong article | Admin unpublish (removes from public) → investigate → republish or soft-delete. |
| 5 | Ad not showing | Check ad active status, position mapping, start/end dates, and dimensions (see ad-guide.md). |
| 6 | Login issues | Verify account status (ACTIVE) → use forgot-password → check rate limits. |
| 7 | Slowness / stale content | SuperAdmin clear cache → verify DB connection → check container logs. |
| 8 | Deploy a code change | Pull → `docker compose up -d --build` → `prisma migrate deploy` if schema changed → smoke test. |

---

## 11. Security Audit

### 11.1 SSL Certificate

| Item | Status / Detail |
|------|-----------------|
| TLS termination | Reverse proxy (aaPanel/Nginx) |
| Certificate type | **To be confirmed / renewed by Lightweb Group** (recommend Let's Encrypt auto-renewal via aaPanel, or an OV/EV cert for higher trust) |
| Domains to cover | `htcmedia.com.np`, `htcmedia.com.np`, `admin.hitecmedianews.com` |
| Required protocols | TLS 1.2 / 1.3; HTTP→HTTPS 301 redirect |
| Renewal | Automate with certbot/aaPanel cron; monitor expiry (renew < 30 days before expiry) |
| HSTS | Recommended: add `Strict-Transport-Security` header on the proxy for the public domain |

> **Handover action:** the current certificate and its expiry date must be shared by HTC Media during the handover, and the renewal contact verified. If Let's Encrypt is used, ownership of the ACME account / DNS verification should be transferred.

### 11.2 Other Security Controls

| Control | Implementation |
|---------|----------------|
| Password hashing | bcrypt, 12 rounds (`BCRYPT_ROUNDS=12`) |
| Authentication | NextAuth credentials + JWT (access 15 min / refresh 7 days) with automatic refresh |
| Authorization | Role-based access control (RBAC) enforced in middleware + per-route `roleMiddleware`; SuperAdmin-only routes for users/roles/settings/audit-logs/cache |
| Route protection | Next.js `middleware.ts` protects `/admin/*` and `/api/admin/*`; admin only for `ADMIN`, `SUPERADMIN`, `AUTHOR` |
| Rate limiting | In-memory LRU counters: login (5/15 min), comments (5/hour), API (100/min) |
| Input validation | Zod schemas on all mutation endpoints (`lib/validations`) + react-hook-form on UI |
| CSRF | NextAuth CSRF token handling; CORS restricted to `CORS_ALLOWED_ORIGIN` |
| XSS / HTML | Public portal sanitizes rendered HTML (`isomorphic-dompurify`) |
| Headers | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-DNS-Prefetch-Control` |
| Sensitive data | Passwords never returned by APIs; JWT secrets, DB credentials, R2 keys kept in env files (**must be rotated and redistributed out-of-band at handover**) |
| Cron security | `CRON_SECRET` token check on `/api/cron/publish-scheduled` |
| Soft deletes | Users and articles use `deletedAt` (no destructive removal) |
| Object storage | R2 access keys scoped to the `hitec-media-news` bucket; public reads via public bucket URL |

### 11.3 Recommended Security Improvements

- [ ] Rotate all secrets (`NEXTAUTH_SECRET`, DB password, R2 keys, `OPENROUTER_API_KEY`, SMTP) at handover.
- [ ] Enforce HTTPS + HSTS at the proxy; verify SSL renewal automation.
- [ ] Add `securityHeaders()` CSP configuration for both Next.js apps.
- [ ] Add external monitoring + uptime alerts and centralized error tracking (e.g., Sentry).
- [ ] Set up a CI pipeline that runs `lint`, `typecheck`, and `build` on every PR.
- [ ] Apply database backups (Neon has automatic backups; configure point-in-time retention policy).
- [ ] Restrict VPS SSH to key-based auth and add a firewall (allow only 22/80/443; internal ports bound to 127.0.0.1).

---

*End of Handover Documentation. Prepared for the transfer of the HTC Media News Portal to Lightweb Group.*
