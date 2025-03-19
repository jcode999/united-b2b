FROM node:18-alpine
RUN apk add --no-cache openssl
EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./

RUN npm ci --omit=dev && npm cache clean --force
# Remove CLI packages since we don't need them in production by default.
# Remove this line if you want to run CLI commands in your container.
RUN npm remove @shopify/cli

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Apply database migrations
RUN npx prisma migrate deploy

RUN npm run build

# You'll probably want to remove this in production, it's here to make it easier to test things!
# RUN rm -f prisma/dev.sqlite



CMD ["npm", "run", "docker-start"]

#docker run --name united-b2b_001 -d --network united-b2b-network -p 3000:3000 -e PMA_HOST=my-mysql united-b2b_001