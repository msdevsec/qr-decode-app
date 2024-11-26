# Database Query Scripts

These scripts help you query the database for users and scans information.

## Available Scripts

### List All Users
Shows all users with their IDs, emails, creation dates, and total scan counts:
```bash
docker-compose exec backend npx ts-node src/scripts/listUsers.ts
```

### Show User's Scans
Shows all scans for a specific user ID. Replace `<userId>` with the actual user ID:
```bash
docker-compose exec backend npx ts-node src/scripts/userScans.ts <userId>
```
Example:
```bash
docker-compose exec backend npx ts-node src/scripts/userScans.ts 1
```

### Show All Scans
Shows all scans in the database with their associated users and statistics:
```bash
docker-compose exec backend npx ts-node src/scripts/allScans.ts
```

## Output Format

### List Users
```
All Users:
==========
ID: 1
Email: user@example.com
Created: 2024-01-01T00:00:00.000Z
Total Scans: 5
-------------------
```

### User Scans
```
User Details:
============
ID: 1
Email: user@example.com
Created: 2024-01-01T00:00:00.000Z
Total Scans: 5

Scans:
======
ID: 1
Type: URL
Content: https://example.com
Created: 2024-01-01T00:00:00.000Z
-------------------
```

### All Scans
```
Scan Statistics:
===============
Total Scans: 10
Unique Users: 3

Scans by Type:
URL: 5
TEXT: 3
WIFI: 2

All Scans:
==========
Scan ID: 1
User ID: 1
User Email: user@example.com
Type: URL
Content: https://example.com
Created: 2024-01-01T00:00:00.000Z
-------------------
