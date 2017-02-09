from convergenceregistry.a1.vary.redhat.com/rhel7-platops-nginx

ADD app/index.html /usr/share/nginx/html/insights/
ADD release /usr/share/nginx/html/insights/
ADD insights.conf /etc/nginx/default.d/

EXPOSE 80

CMD ["/usr/sbin/nginx"]
