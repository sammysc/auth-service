# Use a Node.js base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with clean slate
RUN npm ci

# Copy the rest of the application code
COPY . .

# Rebuild bcrypt from scratch to ensure compatibility with the container environment
RUN npm uninstall bcrypt
RUN npm install bcrypt --build-from-source

# Rebuild sqlite3 for tests with Jest
RUN npm rebuild sqlite3 --build-from-source

# Expose the port the app runs on
EXPOSE 3002
# Command to start the application
CMD ["npm", "start"]
