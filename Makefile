# Makefile pour OnlyRoll VTT
.PHONY: help init up down logs status health

COMPOSE = docker-compose

help: 
	@echo "OnlyRoll VTT - Commandes disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

init:
	@echo "Initialisation d'OnlyRoll..."
	@echo "Construction des images Docker..."
	$(COMPOSE) build
	@echo "Démarrage des services..."
	$(COMPOSE) up -d
	@echo "Attente du démarrage (30s)..."
	@sleep 30
	@echo "OnlyRoll est prêt!"
	@echo ""
	@echo "URLs disponibles:"
	@echo "   Frontend Vue.js:  http://localhost:3000"
	@echo "   Backend API:      http://localhost:8000"
	@echo "   WebSocket:        ws://localhost:3001"
	@echo ""
	@echo "Utilisez 'make status' pour vérifier les services"

up: 
	$(COMPOSE) up -d

down: 
	$(COMPOSE) down

restart: 
	$(COMPOSE) restart

logs: 
	$(COMPOSE) logs -f

logs-backend: 
	$(COMPOSE) logs -f backend

logs-frontend: 
	$(COMPOSE) logs -f frontend

logs-websocket: 
	$(COMPOSE) logs -f websocket

status: 
	@echo "Statut des services OnlyRoll:"
	@echo ""
	$(COMPOSE) ps

health: 
	@echo "Vérification de la santé des services..."
	@echo ""
	@echo -n "Frontend (3000): "
	@curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 2>/dev/null || echo "ÉCHEC"
	@echo ""
	@echo -n "Backend (8000):  "
	@curl -s -o /dev/null -w '%{http_code}' http://localhost:8000 2>/dev/null || echo "ÉCHEC"
	@echo ""
	@echo -n "WebSocket (3001): "
	@curl -s -o /dev/null -w '%{http_code}' http://localhost:3001 2>/dev/null || echo "ÉCHEC"
	@echo ""

clean: 
	$(COMPOSE) down -v
	docker system prune -f

rebuild: 
	$(COMPOSE) down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d