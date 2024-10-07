FROM node:16-alpine3.15
WORKDIR /usr/src/app

RUN apk add --no-cache python3 py3-pip

COPY ./index.ts .
COPY ./package*.json .
COPY ./test.py .
RUN npm install
EXPOSE 3000
CMD ["npx", "tsx", "index.ts"]


