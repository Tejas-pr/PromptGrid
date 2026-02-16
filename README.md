# ION ⚡

ION is a **starter template** for building modern web apps using **Bun**, **Turborepo**, **Next.js**, **shadcn/ui**, and **Prisma**, inspired by Vercel’s architecture.

### 🚀 Usage
Clone the repository and start building immediately.

```bash
bun install
bun run dev
```

## 🐳 Database (PostgreSQL)
``` sh
docker run -d \
  -p 5432:5432 \
  --name ion \
  -e POSTGRES_DB=ion \
  -e POSTGRES_USER=ion \
  -e POSTGRES_PASSWORD=ion \
  postgres
```
#### 👤 Created by Tejas P R