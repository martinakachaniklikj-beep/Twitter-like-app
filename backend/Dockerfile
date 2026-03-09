FROM node:20

WORKDIR /app

# Copy both package.json and yarn.lock
COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

EXPOSE 3001

CMD ["node", "dist/main.js"]
