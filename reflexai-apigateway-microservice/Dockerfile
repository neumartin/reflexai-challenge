FROM node:22.13-bookworm-slim AS builder-api-gateway
#ENV NODE_ENV=production

#RUN apt update && apt install python3 -y && apt clean
RUN npm install -g @nestjs/cli

RUN echo "BULDING API Gateway..."
WORKDIR /app
RUN npm install -g typescript
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY package*.json ./dist
RUN cp -r node_modules ./dist >/dev/null

# Production image
FROM node:22.13-bookworm-slim
ENV NODE_ENV=production

RUN apt-get update && apt-get upgrade -y

# Create a non-root user 'myuser' and assign permissions
RUN useradd -ms /bin/bash myuser
RUN mkdir -p /app /home/myuser && \
    chown -R myuser:myuser /app /home/myuser

# Switch to non-root user
USER myuser

RUN echo "Copying api-gateway..."
WORKDIR /app
COPY --from=builder-api-gateway /app/dist ./

EXPOSE 3000/tcp

CMD ["npm", "run", "start:prod"]