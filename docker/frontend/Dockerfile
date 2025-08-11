FROM node:18-alpine

WORKDIR /app

RUN npm install -g @vue/cli @vitejs/plugin-vue typescript

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]