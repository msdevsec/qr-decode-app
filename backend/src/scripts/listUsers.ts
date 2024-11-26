import { prisma } from '../lib/prisma';

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        created_at: true,
        _count: {
          select: { scans: true }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log('\nAll Users:');
    console.log('==========');
    users.forEach(user => {
      console.log(`
ID: ${user.id}
Email: ${user.email}
Created: ${user.created_at}
Total Scans: ${user._count.scans}
-------------------`);
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error listing users:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Check if user ID was provided as argument
const userId = process.argv[2];
if (userId) {
  console.log('To list all users, run this script without arguments');
  process.exit(1);
}

listUsers();
