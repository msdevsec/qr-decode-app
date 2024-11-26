import { prisma } from '../lib/prisma';

async function getUserScans(userId: number) {
  try {
    // First verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        created_at: true
      }
    });

    if (!user) {
      console.error(`No user found with ID ${userId}`);
      await prisma.$disconnect();
      process.exit(1);
    }

    // Get user's scans
    const scans = await prisma.scan.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log('\nUser Details:');
    console.log('============');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Created: ${user.created_at}`);
    console.log(`Total Scans: ${scans.length}`);

    if (scans.length > 0) {
      console.log('\nScans:');
      console.log('======');
      scans.forEach(scan => {
        console.log(`
ID: ${scan.id}
Type: ${scan.type}
Content: ${scan.content}
Created: ${scan.created_at}
-------------------`);
      });
    } else {
      console.log('\nNo scans found for this user.');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error getting user scans:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Get user ID from command line argument
const userId = process.argv[2];
if (!userId) {
  console.error('Please provide a user ID as argument');
  console.log('Usage: npx ts-node src/scripts/userScans.ts <userId>');
  process.exit(1);
}

getUserScans(parseInt(userId));
