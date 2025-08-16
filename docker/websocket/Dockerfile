FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système
RUN apk add --no-cache \
    curl \
    git

# Installation globale des outils de développement
RUN npm install -g nodemon typescript ts-node

# Variables d'environnement
ENV NODE_ENV=development
ENV PORT=3001
ENV HOST=0.0.0.0

# Copie des fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./

# Installation des dépendances
RUN npm ci --only=production=false

# Copie du code source
COPY . .

# Compilation TypeScript (pour production)
RUN npm run build || echo "Build skipped in development"

# Exposition du port
EXPOSE 3001

# Commande de démarrage
CMD ["npm", "run", "dev"]
