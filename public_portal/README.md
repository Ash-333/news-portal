# HTC Media

A bilingual Nepali/English public news portal built with Next.js, inspired by Onlinekhabar.com.

## Features

- **Bilingual Support**: Full Nepali and English language support with language toggle
- **Responsive Design**: Mobile-first design with mobile bottom navigation
- **Dark Mode**: Built-in dark mode support with next-themes
- **SEO Optimized**: Complete SEO implementation with JSON-LD structured data
- **Performance**: ISR (Incremental Static Regeneration) for optimal performance
- **Analytics**: Google Analytics 4 integration with custom events
- **Sitemaps**: Automatic sitemap generation with news and image sitemaps

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Theming**: next-themes
- **Sitemaps**: next-sitemap
- **Fonts**: Google Fonts (Inter, Merriweather, Noto Sans Devanagari)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── article/[slug]/     # Article detail page
│   │   ├── category/[slug]/    # Category page
│   │   ├── author/[slug]/      # Author page
│   │   ├── tag/[slug]/         # Tag page
│   │   ├── search/             # Search page
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   ├── privacy/            # Privacy policy
│   │   ├── terms/              # Terms of use
│   │   ├── sitemap-news.xml/   # News sitemap API
│   │   ├── sitemap-images.xml/ # Image sitemap API
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Layout components (Header, Footer, etc.)
│   │   ├── article/            # Article page components
│   │   ├── sections/           # Homepage sections
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── ArticleCard.tsx     # Article card component
│   │   └── JsonLd.tsx          # JSON-LD component
│   ├── context/
│   │   └── LanguageContext.tsx # Language context provider
│   ├── providers/
│   │   ├── ThemeProvider.tsx   # Theme provider
│   │   └── QueryProvider.tsx   # TanStack Query provider
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── jsonLd.ts           # JSON-LD helpers
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── data/
│   │   └── sampleData.ts       # Sample data
│   └── locales/
│       ├── en/                 # English translations
│       └── ne/                 # Nepali translations
├── public/                     # Static assets
├── next.config.js              # Next.js configuration
├── next-sitemap.config.js      # Sitemap configuration
├── middleware.ts               # Next.js middleware
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Your website URL | Yes |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | Yes |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID | No |

## SEO Checklist

### On-Page SEO

- [x] Title tags with proper length (50-60 characters)
- [x] Meta descriptions (150-160 characters)
- [x] Canonical URLs
- [x] Hreflang tags for bilingual support
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] JSON-LD structured data
- [x] Semantic HTML
- [x] Alt text for images
- [x] Proper heading hierarchy (H1, H2, H3)

### Technical SEO

- [x] XML sitemaps (main, news, images)
- [x] Robots.txt configuration
- [x] Canonical URLs
- [x] 301 redirects (middleware)
- [x] 404 page
- [x] Fast loading (ISR, image optimization)
- [x] Mobile-friendly design
- [x] HTTPS
- [x] Security headers

### Performance Targets

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- TTFB < 800ms

### Google News Submission

1. Verify your website in Google Search Console
2. Submit your sitemap: `/sitemap.xml`
3. Submit your news sitemap: `/sitemap-news.xml`
4. Apply for Google News inclusion
5. Ensure articles meet Google News content policies

## Customization

### Adding New Categories

Edit `src/data/sampleData.ts` to add new categories:

```typescript
export const categories: Category[] = [
  { id: '11', slug: 'new-category', name: 'New Category', nameNe: 'नयाँ श्रेणी', color: '#ff0000' },
  // ... existing categories
];
```

### Adding New Articles

Edit `src/data/sampleData.ts` to add new articles:

```typescript
export const articles: Article[] = [
  {
    id: '9',
    slug: 'new-article',
    title: 'New Article Title',
    titleNe: 'नयाँ लेख शीर्षक',
    // ... other fields
  },
  // ... existing articles
];
```

### Customizing Colors

Edit `tailwind.config.js` to customize colors:

```javascript
colors: {
  news: {
    red: '#cc0000',
    'red-dark': '#990000',
    // ... other colors
  },
}
```

## License

MIT License - feel free to use this project for your own news portal.

## Support

For support, please contact us through the contact page or email info@yoursite.com.
