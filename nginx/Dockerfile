# Use an official Nginx as the base image
FROM nginx:stable-alpine

# Copy nginx.conf to the container
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Run the server
CMD ["nginx", "-g", "daemon off;"]