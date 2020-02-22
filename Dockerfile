FROM node:12

WORKDIR /makao

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci

COPY start.js .
COPY app/ app/
COPY config/ config/
COPY kakao/ kakao/
COPY lib/ lib/
COPY server/ server/

CMD [ "node", "start.js" ]
