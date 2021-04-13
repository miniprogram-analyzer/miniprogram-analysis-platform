FROM node:latest

WORKDIR /server

COPY ./ ./

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install --production || npm install --production

EXPOSE 7000

CMD [ "npm", "run" "start:no-daemon" ]
