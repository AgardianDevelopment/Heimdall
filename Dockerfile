FROM node:12.16.2

# Create Directory
RUN mkdir -p /usr/src/heimdallr
WORKDIR /usr/src/heimdallr

# Copy and Install Heimdallr
COPY package.json /usr/src/heimdallr
RUN npm install
COPY . /usr/src/heimdallr

# Start Bot
CMD ["node", "heimdallr.js"]