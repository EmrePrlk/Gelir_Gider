FROM 471112771661.dkr.ecr.eu-central-1.amazonaws.com/ubuntu-24-04:24.04

# Set working directory
WORKDIR /application

# Environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PIP_BREAK_SYSTEM_PACKAGES 1
ENV PYTHONUNBUFFERED 1
ENV CRYPTOGRAPHY_DONT_BUILD_RUST 1
ENV PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION python3
ENV TZ=Europe/Minsk

# Set timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    bash \
    nano \
    wget \
    zlib1g-dev \
    libjpeg-dev \
    postgresql-server-dev-all \
    libssl-dev \
    libffi-dev \
    gcc \
    musl-dev \
    g++ \
    python3-pip \
    systemd

# Upgrade pip and setuptools
RUN python3 -m pip install --upgrade setuptools

# Copy requirements.txt before copying the rest of the application
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/application/entrypoint.sh"]

# CMD (optional, can be overridden by entrypoint script or docker run command)
# CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]