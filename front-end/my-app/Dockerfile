# Set the base image to use
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port used by the application
EXPOSE 3000

# Specify the command to start the application
CMD ["npm", "start"]