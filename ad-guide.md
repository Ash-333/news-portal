# Ad Placement Guide

This guide covers all available ad positions, their mapping to the public portal, and recommended image dimensions.

## Backend Positions & Public Portal Mapping

| Position | Label | Public Portal Location | Component |
| -------- | ----- | ---------------------- | --------- |
| `SIDEBAR` | Sidebar | Sidebar (general) | `SidebarAd` |
| `BANNER` | Banner | Banner ads | `BannerAd` |
| `IN_ARTICLE` | In Article | Article detail - middle | `InArticleAd` |
| `SIDEBAR_TOP` | Sidebar Top | Homepage sidebar top | `AdBox` |
| `SIDEBAR_BOTTOM` | Sidebar Bottom | Homepage sidebar bottom | `AdBox` |
| `HOME_MIDDLE` | Home Middle | Homepage - between sections (×5) | `AdBox` |
| `HOME_TOP` | Home Top | Homepage - after featured articles | `AdBox` |
| `TOP_BAR` | Top Bar | Top bar (below header) | `AdBox` |
| `ARTICLE_DETAIL` | Article Detail | Article detail page | `AdBox` |
| `ARTICLE_TITLE` | Article Title | Article - after title | `ArticleTitleAd` |
| `ARTICLE_EXCERPT` | Article Excerpt | Article - after excerpt | `ArticleExcerptAd` |
| `ARTICLE_END` | Article End | Article - at end | `ArticleEndAd` |
| `FEATURED_1` | Featured 1 | Homepage - after 1st featured article | `Featured1Ad` |
| `FEATURED_2` | Featured 2 | Homepage - after 3rd featured article | `Featured2Ad` |
| `FEATURED_3` | Featured 3 | Homepage - after 6th featured article | `Featured3Ad` |
| `LATEST_NEWS` | Latest News | Latest news section | `AdBox` |
| `CATEGORY_SECTION` | Category Section | Category sections | `AdBox` |
| `SECTION_SIDEBAR` | Section Sidebar | Section sidebar | `SectionSidebarAd` |

## Recommended Image Dimensions

| Position | Dimensions | Aspect Ratio | Use Case |
| -------- | ---------- | ------------ | -------- |
| `BANNER` / `HOME_TOP` / `TOP_BAR` / `HOME_MIDDLE` | 728 × 90px | 8:1 | Horizontal banner, leaderboard |
| `SIDEBAR` / `SIDEBAR_TOP` / `SIDEBAR_BOTTOM` / `SECTION_SIDEBAR` | 300 × 250px | 1.2:1 | Medium rectangle, sidebar |
| `IN_ARTICLE` / `ARTICLE_TITLE` / `ARTICLE_EXCERPT` / `ARTICLE_END` | 728 × 90px or 300 × 250px | 8:1 or 1.2:1 | In-content ads |
| `FEATURED_1` / `FEATURED_2` / `FEATURED_3` | 728 × 90px | 8:1 | Horizontal banner between featured |
| `LATEST_NEWS` / `CATEGORY_SECTION` | 728 × 90px | 8:1 | Leaderboard format |
| `ARTICLE_DETAIL` | 728 × 90px or 300 × 250px | 8:1 or 1.2:1 | Article page ads |

## Supported File Types

- **Images:** JPG, PNG, WEBP
- **Animated:** GIF (for animated banners)
- **Scripts:** JavaScript (for ad networks like Google Adsense)

## Best Practices

1. **Use correct dimensions** - Match the ad position with appropriate image size
2. **Keep file sizes small** - Aim for under 150KB for faster page loads
3. **Test on mobile** - Many users browse on mobile devices
4. **Add click-through URL** - Ensure valid link URL for click tracking
5. **Create multiple ads per position** - For rotation, create several ads with the same position

## Creating Ads from Admin Panel

1. Go to `/admin/ads`
2. Click "Create Ad"
3. Fill in:
   - Title (English)
   - Title (Nepali)
   - Click URL (optional)
   - Select position from dropdown
   - Upload image/GIF
4. The ad will be active by default

## Editing Existing Ads

1. Go to `/admin/ads`
2. Click the edit icon (pencil) on the ad card
3. Update fields as needed
4. Optionally upload new image (leave empty to keep existing)
5. Click "Update Ad"

## Toggling Ad Active/Inactive

1. Go to `/admin/ads`
2. Use the toggle switch on each ad card
3. Inactive ads will not be displayed on the public portal