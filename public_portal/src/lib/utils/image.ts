import { Article } from "@/types";

export function getArticleImage(article: Article): string {
  const img = article.featuredImage;
  
  // Clean potentially hardcoded local DB prefixes to force relative local routing
  const makeRelative = (url: string) => url.replace(/^http(s)?:\/\/(localhost|admin_panel):\d+/, "");

  if (typeof img === "string") {
    return makeRelative(img);
  }
  if (img && typeof img === "object" && "url" in img) {
    return makeRelative(img.url ?? article.ogImage ?? "/images/placeholder.jpg");
  }
  return article.ogImage ?? "/images/placeholder.jpg";
}

export function getAuthorAvatar(
  image: string | null | undefined,
  _name: string | undefined,
): string {
  if (image) {
    return image;
  }
  return "/images/avatar-placeholder.jpg";
}

export function getBlurDataUrl(): string {
  return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2UyZThmMCIvPjwvc3ZnPg==";
}