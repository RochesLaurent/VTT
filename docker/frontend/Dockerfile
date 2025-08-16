FROM node:20-alpine

WORKDIR /app

# Installation des dépendances système
RUN apk add --no-cache \
    curl \
    git

# Installation globale des outils de développement
RUN npm install -g @vue/cli @vitejs/plugin-vue typescript vite

# Variables d'environnement pour Vite
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=3000
ENV NODE_ENV=development

# Copie des fichiers de configuration npm
COPY package*.json ./

# Installation des dépendances
RUN npm ci --only=production=false

# Copie du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Commande de démarrage avec configuration optimisée
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
