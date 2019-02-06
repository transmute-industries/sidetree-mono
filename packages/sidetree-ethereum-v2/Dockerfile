FROM node:lts

WORKDIR /app

COPY package.json /app/

RUN yarn --pure-lockfile

COPY dist dist/

EXPOSE 3002

CMD [ "npm", "start" ]
