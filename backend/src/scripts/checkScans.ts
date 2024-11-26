import { prisma } from '../lib/prisma';

async function checkScans() {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 5,
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    console.log('Latest 5 scans:');
    scans.forEach(scan => {
      console.log(`
ID: ${scan.id}
User: ${scan.user.email}
Type: ${scan.type}
Content: ${scan.content}
Created: ${scan.created_at}
-------------------`);
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error checking scans:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkScans();
