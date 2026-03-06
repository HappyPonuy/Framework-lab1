FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
COPY packages/ packages/
COPY apps/medical-appointment-frontend/package*.json apps/medical-appointment-frontend/
RUN npm install
WORKDIR /app/apps/medical-appointment-frontend
COPY apps/medical-appointment-frontend/ .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/apps/medical-appointment-frontend/dist /usr/share/nginx/html