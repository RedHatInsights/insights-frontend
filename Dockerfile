FROM nginx:alpine
COPY insights.conf /etc/nginx/conf.d/insights.conf
COPY build /www-real
RUN  mkdir /www && ln -s /www-real/index.html /www && ln -s /www-real/indexbeta.html /www && ln -s /www-real /www/insights && ln -s /www-real /www/insightsbeta

