FROM node:12 as base

WORKDIR /app

COPY ./package.json .
COPY ./tsconfig.json .

RUN npm cache clean --force
RUN npm install

COPY . .

EXPOSE 8989

FROM base as production

ENV NODE_PATH=./dist


# CMD npm start
# CMD ["node", "app.js"]
RUN npm run build