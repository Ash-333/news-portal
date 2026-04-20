import { Article, ArticleAuthor, ArticleCategory, Category, Tag } from '@/types';

export function getTitle(article: Article, lang: string): string {
  return lang === 'ne' ? article.titleNe ?? '' : article.titleEn ?? '';
}

export function getExcerpt(article: Article, lang: string): string {
  return lang === 'ne' ? article.excerptNe ?? '' : article.excerptEn ?? '';
}

export function getContent(article: Article, lang: string): string {
  return lang === 'ne' ? article.contentNe ?? '' : article.contentEn ?? '';
}

export function getCategoryName(category: ArticleCategory | Category, lang: string): string {
  return lang === 'ne' ? category.nameNe : category.nameEn ?? category.nameNe;
}

export function getTagName(tag: Tag, lang: string): string {
  return lang === 'ne' ? tag.nameNe : tag.nameEn ?? tag.nameNe;
}

export function getAuthorName(author: ArticleAuthor, lang: string): string {
  return lang === 'ne' ? (author.nameNe || author.name) : author.name;
}
