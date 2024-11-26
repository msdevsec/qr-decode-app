import { prisma } from '../lib/prisma';

async function runQueries() {
  try {
    // Get total scans
    const totalScans = await prisma.scan.count();
    console.log(`\nTotal scans in database: ${totalScans}`);

    // Get latest scans
    const latestScans = await prisma.scan.findMany({
      orderBy: { created_at: 'desc' },
      take: 5,
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    console.log('\nLatest 5 scans:');
    latestScans.forEach(scan => {
      console.log(`
ID: ${scan.id}
User: ${scan.user.email}
Type: ${scan.type}
Content: ${scan.content}
Created: ${scan.created_at}
-------------------`);
    });

    // Get scans by type
    const scansByType = await prisma.scan.groupBy({
      by: ['type'],
      _count: true,
      orderBy: {
        _count: {
          type: 'desc'
        }
      }
    });

    console.log('\nScans by type:');
    scansByType.forEach(type => {
      console.log(`${type.type}: ${type._count}`);
    });

    // Get user scan counts
    const userScans = await prisma.user.findMany({
      select: {
        email: true,
        _count: {
          select: { scans: true }
        }
      },
      orderBy: {
        scans: {
          _count: 'desc'
        }
      }
    });

    console.log('\nScans per user:');
    userScans.forEach(user => {
      console.log(`${user.email}: ${user._count.scans} scans`);
    });

    // Get today's scans
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayScans = await prisma.scan.count({
      where: {
        created_at: {
          gte: today
        }
      }
    });

    console.log(`\nScans today: ${todayScans}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error running queries:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runQueries();
