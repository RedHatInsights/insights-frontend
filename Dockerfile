FROM nginx:alpine

RUN mkdir /www && mkdir /www-real && chown nginx:nginx -R /www && chown nginx:nginx -R /www-real
# per the https://docs.openshift.com/enterprise/3.0/creating_images/guidelines.html#use-uid
RUN chmod 777 -R /var/log/nginx && chmod 777 -R /var/cache/nginx

RUN ln -s /www-real/index.html /www && ln -s /www-real/indexbeta.html /www && ln -s /www-real /www/insights && ln -s /www-real /www/insightsbeta

COPY insights.conf /etc/nginx/insights.conf
COPY build /www-real

EXPOSE 8080
STOPSIGNAL SIGTERM

# USER nginx
USER 100
CMD ["nginx", "-g", "daemon off;", "-c", "/etc/nginx/insights.conf"]
