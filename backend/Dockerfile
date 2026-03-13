FROM node:20

WORKDIR /app

# Copy package files (they're at root of build context since rootDirectory is backend)
COPY package.json yarn.lock ./

# Copy prisma schema before yarn install so postinstall can run prisma generate
COPY prisma ./prisma

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

# Run migrations against the connected DB, then start the app (DATABASE_URL set by Railway)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]