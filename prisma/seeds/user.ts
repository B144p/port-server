import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export const superUserSeed = async (prisma: PrismaClient) => {
  if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
    throw new Error('Email or password not found');
  }
  console.log('Add super user => Inprogress');
  const userInitData = {
    email: process.env.SEED_ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10),
    isSuperUser: true,
  };
  await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL },
    update: userInitData,
    create: userInitData,
  });
  console.log('Add super user => Success');
};
