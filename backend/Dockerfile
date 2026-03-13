FROM node:20

WORKDIR /app

# Copy root package files for workspace
COPY package.json yarn.lock ./

# Copy backend-specific files including prisma schema (before yarn install so postinstall can run prisma generate)
COPY backend/package.json backend/yarn.lock ./backend/
COPY backend/prisma ./backend/prisma

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["node", "dist/main.js"]
