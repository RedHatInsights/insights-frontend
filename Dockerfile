FROM nginx:alpine
COPY insights.conf /etc/nginx/conf.d/insights.conf
COPY build /www
