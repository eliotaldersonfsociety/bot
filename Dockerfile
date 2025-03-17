# Etapa de despliegue

FROM node:21-alpine3.18 AS deploy

WORKDIR /

# Copia los archivos necesarios

COPY ./dist ./dist

COPY ./assets ./assets

COPY package.json ./


COPY package-lock.json ./

# Instala las dependencias de producciÃ³n y limpia el cachÃ©

RUN npm install --production && npm cache clean --force \
&& addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
&& rm -rf /root/.npm /root/.node-gyp

# Exponer el puerto en el que la aplicaciÃ³n se ejecutarÃ¡

ARG PORT

ENV PORT $PORT

EXPOSE $PORT

# Define el comando para iniciar la aplicaciÃ³n

CMD ["node", "--loader", "ts-node/esm", "dist/src/app.js"]
