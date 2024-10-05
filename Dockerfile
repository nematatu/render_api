FROM node:16-alpine3.15
WORKDIR /usr/src/app
COPY ./index.ts .
COPY ./package*.json .
RUN npm install
EXPOSE 3000
CMD ["npx", "tsx", "index.ts"]


