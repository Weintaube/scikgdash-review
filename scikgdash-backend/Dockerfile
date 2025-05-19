# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /api

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire API directory into the container
COPY ./ .

# Expose the port FastAPI will run on
EXPOSE 8001

# Define the command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]

#in /api folder:
#docker build -t fastapi-database .
#docker run --env-file .env.local -d -p 8001:8001 -v $(pwd)/data:/api/data fastapi-databases