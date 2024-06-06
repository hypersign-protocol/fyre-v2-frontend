FROM node:20 as stage-build

RUN npm i pnpm -g

WORKDIR /app

COPY ./package.json .

ENV NODE_OPTIONS=--max_old_space_size=8192

RUN pnpm i


COPY . .


ENV VITE_API_ENDPOINT='__VITE_API_ENDPOINT__'

ENV VITE_API_TOKEN='__VITE_API_TOKEN__'

ENV VITE_APP_AUTH0_DOMAIN='__VITE_APP_AUTH0_DOMAIN__'

ENV VITE_APP_AUTH0_CLIENT_ID='__VITE_APP_AUTH0_CLIENT_ID__'

ENV VITE_APP_TELEGRAM_BOT_ID='__VITE_APP_TELEGRAM_BOT_ID__'

ENV VITE_APP_WC_PROJECT_ID='__VITE_APP_WC_PROJECT_ID__'

RUN pnpm run build


FROM nginx:latest as stage-serve
COPY --from=stage-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]