FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm run install

RUN npm run build

CMD ["npm", "start"]