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
  profilePhoto: string | null | undefined,
  _name: string | undefined,
): string {
  if (profilePhoto) {
    return profilePhoto;
  }
  return "/images/avatar-placeholder.jpg";
}