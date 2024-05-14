FROM node:19-alpine AS deps

WORKDIR /app

VOLUME /app


ARG PORT

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Install make
RUN apk add --no-cache make

# Install GCC
RUN apk add build-base

COPY . .

RUN npm i

CMD [ "npm", "run", "dev", "-p ${PORT}" ]