# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies, including Prisma CLI
RUN npm install

# Copy the Prisma schema and migration files
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Expose the port your application listens on
EXPOSE 5000

# Apply Prisma migrations during container runtime
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
