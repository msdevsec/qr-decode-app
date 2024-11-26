import { prisma } from '../lib/prisma';

async function getAllScans() {
  try {
    // Get all scans with user details
    const scans = await prisma.scan.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Get some statistics
    const totalScans = scans.length;
    const uniqueUsers = new Set(scans.map(scan => scan.user.id)).size;
    const scanTypes = scans.reduce((acc, scan) => {
      acc[scan.type] = (acc[scan.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Print statistics
    console.log('\nScan Statistics:');
    console.log('===============');
    console.log(`Total Scans: ${totalScans}`);
    console.log(`Unique Users: ${uniqueUsers}`);
    console.log('\nScans by Type:');
    Object.entries(scanTypes).forEach(([type, count]) => {
      console.log(`${type}: ${count}`);
    });

    // Print all scans
    console.log('\nAll Scans:');
    console.log('==========');
    scans.forEach(scan => {
      console.log(`
Scan ID: ${scan.id}
User ID: ${scan.user.id}
User Email: ${scan.user.email}
Type: ${scan.type}
Content: ${scan.content}
Created: ${scan.created_at}
-------------------`);
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error getting all scans:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

getAllScans();
