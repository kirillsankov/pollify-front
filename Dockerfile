FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

# Create a production build
RUN npm run build

FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/build /usr/share/nginx/html

# Create a custom nginx config to handle React Router
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]