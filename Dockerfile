FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm install --prefix client && npm install --prefix server

COPY . .

RUN npm --prefix client run build && npm --prefix server run build

EXPOSE 4000 5173

CMD ["sh", "-c", "npm run dev:server & npm run dev:client -- --host 0.0.0.0"]
