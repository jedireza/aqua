FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD [ "bash","-c","sleep 2; npm start" ]
