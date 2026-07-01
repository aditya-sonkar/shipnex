# backend/Dockerfile
FROM node:20-alpine

#install openssl needed for Prisma client
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy prisma schema and generate database client
COPY prisma ./prisma/
RUN npx prisma generate 

# Copy the rest of the backend files 
COPY . .

EXPOSE 5000

CMD ["npm", "start"]