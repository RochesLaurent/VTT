FROM node:18-alpine

WORKDIR /app

RUN npm install -g nodemon typescript ts-node

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]