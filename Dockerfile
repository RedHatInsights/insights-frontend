FROM nginx:alpine

RUN mkdir /www && mkdir /www-real && chown nginx:nginx -R /www && chown nginx:nginx -R /www-real
# per the https://docs.openshift.com/enterprise/3.0/creating_images/guidelines.html#use-uid
RUN chmod 777 -R /var/log/nginx && chmod 777 -R /var/cache/nginx

RUN sed 's|pid[ ]*/var/run/nginx.pid;|pid /tmp/nginx.pid;|' -i /etc/nginx/nginx.conf
RUN sed 's|user[ ]*nginx;||' -i /etc/nginx/nginx.conf
RUN ln -s /www-real/index.html /www && ln -s /www-real/indexbeta.html /www && ln -s /www-real /www/insights && ln -s /www-real /www/insightsbeta
RUN rm /etc/nginx/conf.d/default.conf

COPY insights.conf /etc/nginx/conf.d/insights.conf
COPY build /www-real

EXPOSE 8080
STOPSIGNAL SIGTERM

# USER nginx
USER 100
CMD ["nginx", "-g", "daemon off;"]
