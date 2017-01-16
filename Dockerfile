FROM node:6

# Provides cached layer for node_modules (hack)
# Update npm to latest
RUN npm install -g npm --registry=https://registry.npm.taobao.org

# Add this to your Dockerfile, after your dependencies, but before your app code.
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY package.json /usr/src/

RUN npm install --production --registry=https://registry.npm.taobao.org

COPY . /usr/src

# Expose port
EXPOSE 8000

# Run app
CMD ["npm", "start"]