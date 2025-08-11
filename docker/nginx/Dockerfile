FROM nginx:alpine

RUN apk add --no-cache \
    curl \
    nano \
    net-tools

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

RUN mkdir -p /var/log/nginx

RUN mkdir -p /etc/nginx/ssl

EXPOSE 80 443

LABEL maintainer="OnlyRoll VTT Team"
LABEL description="nginx reverse proxy for OnlyRoll VTT"
LABEL version="1.0"

CMD ["nginx", "-g", "daemon off;"]