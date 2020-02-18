FROM node:12

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./start.js ./
COPY ./app ./
COPY ./config ./
COPY ./kakao ./
COPY ./server ./

RUN npm install

CMD [ "node", "start.js" ]
