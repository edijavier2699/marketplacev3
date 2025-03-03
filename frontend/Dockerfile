# Usa la imagen base de Node.js
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json para instalar dependencias
COPY package.json package-lock.json ./


# Copiar el resto de la aplicación después de instalar dependencias
COPY . .

# Exponer el puerto en el que la aplicación está corriendo
EXPOSE 5173

# Comando por defecto para iniciar el frontend
CMD ["npm", "run", "dev"]
