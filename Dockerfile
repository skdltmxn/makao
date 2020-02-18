FROM node:13

WORKDIR /app

COPY ./packages*.json ./
COPY ./start.js ./
COPY ./app ./
COPY ./config ./
COPY ./kakao ./
COPY ./server ./

RUN npm ci --only=production

CMD [ "node", "start.js" ]
