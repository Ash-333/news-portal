import { Article } from "@/types";

export function getArticleImage(article: Article): string {
  const img = article.featuredImage;
  if (typeof img === "string") {
    return img.replace(/^http:\/\/localhost:3000/, "");
  }
  if (img && typeof img === "object" && "url" in img) {
    return (img.url ?? article.ogImage ?? "/images/placeholder.jpg").replace(
      /^http:\/\/localhost:3000/,
      "",
    );
  }
  return article.ogImage ?? "/images/placeholder.jpg";
}

export function getAuthorAvatar(
  profilePhoto: string | null,
  _name: string,
): string {
  return profilePhoto ?? "/images/avatar-placeholder.jpg";
}
