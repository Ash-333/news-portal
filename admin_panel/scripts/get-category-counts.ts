import { prisma } from '@/lib/prisma'

async function getCategoriesWithArticleCounts() {
  // Get all categories with their article counts
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              deletedAt: null,
              status: 'PUBLISHED',
              publishedAt: { lte: new Date() }
            }
          }
        }
      }
    },
    orderBy: [
      { parentId: 'asc' },
      { nameEn: 'asc' }
    ]
  })

  // Format the results
  const results = categories.map(cat => ({
    id: cat.id,
    slug: cat.slug,
    nameEn: cat.nameEn,
    nameNe: cat.nameNe,
    parentId: cat.parentId,
    articleCount: cat._count.articles,
    isMainCategory: cat.parentId === null
  }))

  console.log('Categories and Article Counts:')
  console.log('===============================')

  results.forEach(cat => {
    const indent = cat.isMainCategory ? '' : '  └─ '
    console.log(`${indent}${cat.nameEn} (${cat.slug}): ${cat.articleCount} articles`)
  })

  return results
}

getCategoriesWithArticleCounts()
  .catch(console.error)
  .finally(() => process.exit(0))