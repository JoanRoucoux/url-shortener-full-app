# Use an official Node runtime as the base image
FROM node:22.11.0

# Set the working directory
WORKDIR /usr/src/client

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the application
CMD [ "npm", "run", "start" ]