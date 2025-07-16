FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .
RUN npx prisma migrate dev --name init
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3786

CMD npm run dev

