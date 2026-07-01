# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

#Copy dependency files
COPY package*.json ./
RUN npm install

# Copy all files and compile the Next.js app
COPY . .
ENV BACKEND_URL=http://backend:5000
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]