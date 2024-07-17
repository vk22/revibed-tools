FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

CMD [ "yarn", "dev" ]
# CMD /wait && npm run start:dev