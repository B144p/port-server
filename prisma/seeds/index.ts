import { PrismaClient } from '@prisma/client';
import { superUserSeed } from './user';

const prisma = new PrismaClient();

async function main() {
  await superUserSeed(prisma);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
