#!/bin/bash

echo "🔧 Diagnostic et correction frontend - OnlyRoll"
echo "==============================================="

# 1. Diagnostic des volumes et containers
echo "1. État actuel des containers..."
docker-compose ps frontend

echo -e "\n2. Vérification du volume node_modules..."
docker volume ls | grep frontend_modules

# 3. Entrer dans le container et diagnostiquer
echo -e "\n3. Diagnostic dans le container..."
echo "Vérification de la présence de yup:"
docker-compose exec frontend ls -la /app/node_modules/yup/ 2>/dev/null || echo "❌ yup non trouvé dans node_modules"

echo -e "\nVérification de package.json:"
docker-compose exec frontend cat /app/package.json | grep yup

echo -e "\nVérification des imports TypeScript:"
docker-compose exec frontend npm ls yup 2>/dev/null || echo "❌ yup non résolu par npm"

# 4. Nettoyage complet et reconstruction
echo -e "\n4. Nettoyage complet..."
docker-compose stop frontend
docker volume rm onlyroll_frontend_modules 2>/dev/null || true

echo -e "\n5. Reconstruction propre..."
docker-compose build --no-cache frontend

echo -e "\n6. Installation des dépendances..."
docker-compose run --rm frontend npm ci

echo -e "\n7. Vérification de l'installation..."
docker-compose run --rm frontend npm ls yup

echo -e "\n8. Test de la résolution de module..."
docker-compose run --rm frontend node -e "console.log(require.resolve('yup'))"

echo -e "\n9. Redémarrage du frontend..."
docker-compose up -d frontend

echo -e "\n10. Logs de démarrage..."
sleep 5
docker-compose logs frontend --tail=20

echo -e "\n✅ Diagnostic terminé !"
echo "🌐 Testez maintenant : http://localhost:3000/auth/login"