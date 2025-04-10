#!/bin/bash

# Script para gerar o modelo ER do banco de dados
# Este script utiliza o Sequelize para gerar o modelo ER do banco de dados

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Gerando modelo ER do banco de dados ===${NC}"

# Verificar se o GraphViz está instalado
if ! command -v dot &> /dev/null; then
    echo -e "${YELLOW}GraphViz não está instalado. Tentando instalar...${NC}"
    apt-get update && apt-get install -y graphviz
    
    if ! command -v dot &> /dev/null; then
        echo -e "${RED}Falha ao instalar GraphViz. Por favor, instale manualmente.${NC}"
        exit 1
    fi
fi

# Criar diretório para o modelo ER se não existir
mkdir -p docs/er

# Navegar para o diretório da API
cd api

# Gerar modelo ER usando Sequelize
echo -e "${YELLOW}Gerando modelo ER usando Sequelize...${NC}"
npx sequelize-erd --source ./src/models --destination ../docs/er/database-model.svg --engine dot

# Verificar se o modelo foi gerado com sucesso
if [ -f "../docs/er/database-model.svg" ]; then
    echo -e "${GREEN}Modelo ER gerado com sucesso em docs/er/database-model.svg${NC}"
else
    echo -e "${RED}Falha ao gerar o modelo ER.${NC}"
    exit 1
fi

# Gerar também uma versão PNG para melhor compatibilidade
echo -e "${YELLOW}Gerando versão PNG do modelo ER...${NC}"
dot -Tpng ../docs/er/database-model.svg -o ../docs/er/database-model.png

# Verificar se a versão PNG foi gerada com sucesso
if [ -f "../docs/er/database-model.png" ]; then
    echo -e "${GREEN}Versão PNG do modelo ER gerada com sucesso em docs/er/database-model.png${NC}"
else
    echo -e "${RED}Falha ao gerar a versão PNG do modelo ER.${NC}"
    exit 1
fi

echo -e "${GREEN}=== Modelo ER gerado com sucesso! ===${NC}"
