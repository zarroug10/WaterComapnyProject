# Stage 1: Build Angular app
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod

# Stage 2: Serve Angular app with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/my-angular-app /usr/share/nginx/html
