// import "dotenv/config";
// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from "../generated/prisma/client";



// const connectionString = process.env.DATABASE_URL

// const adapter = new PrismaPg({ connectionString })
// const prisma = new PrismaClient({ adapter })

// export { prisma }
//======================================
// import "dotenv/config";
// import { PrismaClient } from "../generated/prisma/client";


// const prisma = new PrismaClient();

// export { prisma };

//========================================
// import "dotenv/config";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "../generated/prisma/client";

// const adapter = new PrismaMariaDb({
//     host: process.env.DATABASE_HOST!,
//     user: process.env.DATABASE_USER!,
//     password: process.env.DATABASE_PASSWORD!,
//     database: process.env.DATABASE_NAME!,
//     connectionLimit: 5,
// });
// const prisma = new PrismaClient({ adapter });

// export { prisma };

//============================================
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
    host: "mysql-1dc508b4-course-platform.g.aivencloud.com",
    port: 18580,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: false, // Aiven এর জন্য important
    },
});

const prisma = new PrismaClient({ adapter });

export { prisma };