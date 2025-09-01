import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const exists = await prisma.user.findUnique({ where: { email } });
  if (!exists) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        role: 'ADMIN',
        passwordHash: await bcrypt.hash('adminpass', 10),
      },
    });
  }
  console.log('seed done');
}
main().finally(() => prisma.$disconnect());
