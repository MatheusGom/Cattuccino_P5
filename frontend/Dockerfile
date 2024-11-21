FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install axios
RUN npm install react-icons

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
