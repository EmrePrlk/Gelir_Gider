# Use the official Bun image as the base image
FROM 471112771661.dkr.ecr.eu-central-1.amazonaws.com/ovenbun1:1 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .
COPY .env .env

# Build the Next.js application
RUN bun run build

# Start a new stage for a smaller production image
FROM 471112771661.dkr.ecr.eu-central-1.amazonaws.com/ovenbun1-slim:1-slim

# Set the working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lockb ./bun.lockb
COPY --from=builder /app/.env ./.env

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["bun", "start"]
