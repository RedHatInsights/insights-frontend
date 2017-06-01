FROM nginx:alpine
COPY insights.conf /etc/nginx/conf.d/insights.conf
COPY build /www-real

RUN sed 's|pid[ ]*/var/run/nginx.pid;|pid /tmp/nginx.pid;|' -i /etc/nginx/nginx.conf
RUN sed 's|user[ ]*nginx;||' -i /etc/nginx/nginx.conf
RUN mkdir /www && ln -s /www-real/index.html /www && ln -s /www-real/indexbeta.html /www && ln -s /www-real /www/insights && ln -s /www-real /www/insightsbeta
RUN rm /etc/nginx/conf.d/default.conf

# per the https://docs.openshift.com/enterprise/3.0/creating_images/guidelines.html#use-uid
RUN chmod 777 -R /var/log/nginx
RUN chmod 777 -R /var/cache/nginx
RUN chown nginx:nginx -R /www
RUN chown nginx:nginx -R /www-real

EXPOSE 8080
STOPSIGNAL SIGTERM
USER 100 # again per the doc
CMD ["nginx", "-g", "daemon off;"]
