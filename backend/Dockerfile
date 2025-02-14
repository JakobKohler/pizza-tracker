FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .

COPY start.sh /app/start.sh

RUN chmod +x /app/start.sh

EXPOSE 5000

CMD ["/bin/sh", "/app/start.sh"]