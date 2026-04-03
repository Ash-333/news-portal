# Language Switching Issue in Article Pages - Analysis & Fix Plan

## Problem Statement

When switching language to English from the header, the article page content remains mostly in Nepali. The language toggle works (changing UI elements), but article content doesn't switch properly.

## Root Cause

The article page (`src/app/article/[slug]/page.tsx`) is a **Server Component** that determines language based on article data:

```tsx
// Line 85-88 in page.tsx
const isNepali = !!article.contentNe;
const content = article.contentNe || article.contentEn || "";
const lang = isNepali ? "ne" : "en";
```

This is a **static** determination made at **build/request time** on the server. When the user toggles language in the header:

1. The header is a **Client Component** that uses `LanguageContext` to change language
2. The language is stored in localStorage and React state
3. However, the article page is server-rendered and ignores the LanguageContext
4. The language is determined by whether `contentNe` exists in the article data, not by user's language preference

## Why This Happens

- The page uses `isNepali = !!article.contentNe` to decide language
- This checks if the article has Nepali content, not the user's language preference
- Server Components cannot access Client Context (LanguageContext)
- The language selection happens on the server before the client can influence it

## The Fix Plan

### Option 1: Pass Language from URL (Recommended)

The cleanest solution is to use URL-based language routing:

1. **Modify the page to read language from URL** - Check `searchParams.lang` or use a route like `/en/article/[slug]`
2. **Update header links** - Pass language parameter when navigating to articles
3. **Keep fallback logic** - If no language in URL, check for content in both languages

### Option 2: Client-Side Language Context in Article Page

Make the article content section a client component that uses LanguageContext:

1. **Create a client wrapper** - Wrap the article content in a client component
2. **Use LanguageContext** - Determine language based on user's preference
3. **Pass article data** - Pass the full article object to the client component

## Recommended Solution

I recommend **Option 1** (URL-based) because:

1. It's more SEO-friendly
2. Language preference is shareable via URL
3. Works with Next.js caching properly
4. Follows Next.js conventions

### Implementation Steps

1. **Update `src/app/article/[slug]/page.tsx`**
   - Read language from searchParams
   - Use URL language if provided, otherwise check available content
2. **Update header navigation** - Include language in article links (optional but recommended)

3. **Update client components** - Make sidebar components respect the passed `isNepali` prop (already done correctly)

## Files That Need Changes

| File                               | Change Required                                      |
| ---------------------------------- | ---------------------------------------------------- |
| `src/app/article/[slug]/page.tsx`  | Add language detection from URL/searchParams         |
| `src/components/layout/Header.tsx` | Update nav item links to include language (optional) |

## Key Code Changes

### In `page.tsx`:

```tsx
// Add searchParams to props
interface ArticlePageProps {
  params: { slug: string };
  searchParams: { lang?: string };
}

// Use language from URL or determine from content
const requestedLang = searchParams?.lang;
const hasContentEn = !!article.contentEn;
const hasContentNe = !!article.contentNe;

// If URL specifies language, use it; otherwise determine from content
let isNepali: boolean;
if (requestedLang === "en") {
  isNepali = false;
} else if (requestedLang === "ne") {
  isNepali = true;
} else {
  isNepali = hasContentNe; // Default behavior
}
```

This way:

- `/article/my-article?lang=en` → shows English content
- `/article/my-article?lang=ne` → shows Nepali content
- `/article/my-article` → shows Nepali if available (backward compatible)
