FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci --production

COPY src ./src
COPY .env.example .env.example

EXPOSE 4000

CMD ["node", "src/index.js"]
