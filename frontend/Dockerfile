# Stage build (build React/Vite)
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage Nginx (serve hasil build + proxy ke backend)
FROM nginx:alpine

# Copy hasil build ke folder HTML Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Pakai config nginx custom yang barusan kamu bikin
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
