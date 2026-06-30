# Use an official Node.js runtime as a base image
FROM --platform=linux/amd64 node:20

RUN apt-get update && \
    apt-get install -y openssl


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]