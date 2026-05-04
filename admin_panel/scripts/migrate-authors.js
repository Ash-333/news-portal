const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration...');
  
  // 1. Get all users
  const users = await prisma.user.findMany({
    select: { id: true, name: true, nameNe: true, bio: true, profilePhoto: true, email: true }
  });
  console.log(`Found ${users.length} users`);

  // 2. Create authors from users
  for (const user of users) {
    try {
      await prisma.author.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          nameNe: user.nameNe,
          bio: user.bio,
          image: user.profilePhoto,
          email: user.email,
          isActive: true,
        }
      });
    } catch (e) {
      console.log(`Error creating author ${user.id}:`, e.message);
    }
  }
  
  const authorCount = await prisma.author.count();
  console.log(`Created ${authorCount} authors`);

  console.log('Migration complete!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());