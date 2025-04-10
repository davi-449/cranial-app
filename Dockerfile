# Imagem base
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Estágio de build para o código compartilhado
FROM base AS shared-builder
WORKDIR /app/shared
RUN npm run build

# Estágio de build para o backend
FROM base AS api-builder
WORKDIR /app/api
COPY --from=shared-builder /app/shared/dist /app/shared/dist
RUN npm run build

# Estágio de build para o frontend
FROM base AS mobile-builder
WORKDIR /app/mobile
COPY --from=shared-builder /app/shared/dist /app/shared/dist
RUN npm run build

# Imagem final para o backend
FROM node:20-alpine AS api
WORKDIR /app
COPY --from=api-builder /app/api/dist /app/api/dist
COPY --from=api-builder /app/api/package*.json /app/api/
COPY --from=shared-builder /app/shared/dist /app/shared/dist
COPY --from=shared-builder /app/shared/package*.json /app/shared/
WORKDIR /app/api
RUN npm install --production
EXPOSE 3000
CMD ["node", "dist/index.js"]

# Imagem para desenvolvimento
FROM base AS development
WORKDIR /app
COPY --from=shared-builder /app/shared/dist /app/shared/dist
EXPOSE 3000 19000 19001 19002
CMD ["npm", "run", "dev"]
