FROM node:13

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./start.js ./
COPY ./app ./
COPY ./config ./
COPY ./kakao ./
COPY ./server ./

RUN npm ci

CMD [ "node", "start.js" ]
