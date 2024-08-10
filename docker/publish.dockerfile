FROM node:alpine as base


# Step for installing dependencies for build
FROM base as full-deps

# See: https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat

# Set working directory
WORKDIR /app

# Copy dependency list
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile


# Step for installing dependencies for production
FROM base as prod-deps

# See: https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat

# Set working directory
WORKDIR /app

# Copy dependency list
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production


# Step for building the app
FROM base as builder

ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy dependencies
COPY --from=full-deps /app/node_modules ./node_modules

# Copy files
COPY .env babel.config.json package.json yarn.lock ./
COPY src ./src
COPY docs ./docs

RUN yarn run build


# Step for running the app
FROM base as runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bilbil

# Set working directory
WORKDIR /app

# Copy dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy files
COPY .env package.json yarn.lock ./
COPY ./docs ./docs
COPY --from=builder --chown=bilbil:nodejs /app/dist ./dist

# Expose port
ENV PORT=3000
EXPOSE 3000

CMD node ./dist/main.js
