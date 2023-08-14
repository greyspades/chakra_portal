# Use an official Nginx image as the base
FROM nginx:alpine

# Copy static files from local machine to the container
COPY ./out /usr/share/nginx/html

# Expose port 90
EXPOSE 90

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
