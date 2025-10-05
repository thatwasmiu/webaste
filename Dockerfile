FROM nginx:1.25-alpine

# Copy custom Nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy prebuilt Angular files
COPY dist/webaste/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]