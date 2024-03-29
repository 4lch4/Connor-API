FROM node:latest

WORKDIR /srv/api

COPY . .

RUN npm i
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
