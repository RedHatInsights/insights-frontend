FROM nginx:alpine
COPY insights.conf /etc/nginx/conf.d/insights.conf
COPY build /www-real

RUN sed 's|pid[ ]*/var/run/nginx.pid;|pid /tmp/nginx.pid;|' -i /etc/nginx/nginx.conf
RUN sed 's|user[ ]*nginx;||' -i /etc/nginx/nginx.conf
RUN mkdir /www && ln -s /www-real/index.html /www && ln -s /www-real/indexbeta.html /www && ln -s /www-real /www/insights && ln -s /www-real /www/insightsbeta
RUN rm /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 8080
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
