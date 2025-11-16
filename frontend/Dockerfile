FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências (incluindo tailwindcss-animate)
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Expor porta
EXPOSE 3000

# Comando de desenvolvimento
CMD ["npm", "run", "dev"]
