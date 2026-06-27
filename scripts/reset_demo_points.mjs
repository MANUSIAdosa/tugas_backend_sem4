import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

try {
  const user = await prisma.users.findUnique({ where: { username: 'demo_user' } });
  if (!user) {
    console.log('demo_user tidak ditemukan');
    process.exit(0);
  }
  await prisma.users.update({
    where: { id: user.id },
    data: { points: 0, level: 1 }
  });
  console.log(`✅ Poin demo_user direset ke 0 (sebelumnya: ${user.points}), level ke 1`);
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await prisma.$disconnect();
}
