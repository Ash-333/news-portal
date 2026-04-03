
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  })
  console.log('Users:', JSON.stringify(users, null, 2))

  const categories = await prisma.category.findMany({
    select: { id: true, nameEn: true }
  })
  console.log('Categories:', JSON.stringify(categories, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
