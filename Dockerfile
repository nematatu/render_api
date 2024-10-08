FROM node:16-alpine3.15
WORKDIR /usr/src/app

# 必要なパッケージをインストール
RUN apk add --no-cache python3 py3-pip zlib-dev jpeg-dev gcc musl-dev freetype-dev lcms2-dev build-base python3-dev

COPY ./index.ts .
COPY ./package*.json .
COPY ./Image .
COPY ./test.py .
COPY ./requirements.txt . 
RUN pip install -r requirements.txt
RUN npm install
EXPOSE 3000
CMD ["npx", "tsx", "index.ts"]