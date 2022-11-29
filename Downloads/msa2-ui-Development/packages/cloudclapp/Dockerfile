ARG PACKAGE_DIR="package/"
ARG PACKAGE_NAME="cloudclapp"
ARG PACKAGE_ROOT=$PACKAGE_DIR$PACKAGE_NAME
# Create a build of the app
FROM node:16.13.0-alpine as build-app

ARG REACT_APP_MSA_VERSION
ARG REACT_APP_API_BASE_URL
ARG MAX_OLD_SPACE_SIZE=4096
ARG PACKAGE_NAME
ARG PACKAGE_DIR

RUN apk add yarn

WORKDIR /app

COPY package.json .
COPY jsconfig.json .
COPY yarn.lock .
COPY $PACKAGE_DIR $PACKAGE_DIR

RUN yarn install --frozen-lockfile

RUN REACT_APP_MSA_VERSION=$REACT_APP_MSA_VERSION \
  REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL \
  REACT_APP_API_PATH=/ubi-api-rest \
  PUBLIC_URL=/cloudclapp \
  NODE_OPTIONS=--max_old_space_size=$MAX_OLD_SPACE_SIZE \
  yarn build $PACKAGE_NAME


# Serve the build via nginx
FROM nginxinc/nginx-unprivileged:stable-alpine

ARG PACKAGE_ROOT

USER root
COPY --from=build-app app/$PACKAGE_ROOT/build /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html

RUN apk update && \
  apk upgrade && \
  apk add --no-cache bash

RUN rm /etc/nginx/conf.d/default.conf

COPY $PACKAGE_ROOT/nginx/nginx.conf /etc/nginx/conf.d
COPY $PACKAGE_ROOT/nginx/startup.sh .
USER nginx
CMD ["./startup.sh", "/usr/share/nginx/html/index.html"]
