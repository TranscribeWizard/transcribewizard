# Use the nvidia/cuda image as the base image
FROM nvidia/cuda:12.1.0-runtime-ubuntu20.04


# Install system packages and update
RUN apt-get update && \
    apt-get install -y wget curl ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Install Miniconda
ENV CONDA_AUTO_UPDATE_CONDA=false
RUN wget -q https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh && \
    /bin/bash /tmp/miniconda.sh -b -p /opt/conda && \
    rm /tmp/miniconda.sh && \
    /opt/conda/bin/conda clean -afy && \
    ln -s /opt/conda/etc/profile.d/conda.sh /etc/profile.d/conda.sh && \
    echo ". /opt/conda/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc && \
    echo "export PATH=/opt/conda/bin:$PATH" >> ~/.bashrc

ENV PATH=/opt/conda/bin:$PATH


# installing npm and nvm 
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=18.16.0
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash && \
    . $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default && \
    rm -rf /var/lib/apt/lists/*

# Install rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y \
    && /root/.cargo/bin/rustup install stable

# Install pip
RUN /opt/conda/bin/conda install -y pip

# Install whisper-ctranslate2
RUN pip install whisper-ctranslate2

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp


# Set the working directory
RUN mkdir -p /app
WORKDIR /app


# Copy and install Node.js dependencies
COPY package*.json ./
COPY . . 
RUN npm install --omit=dev   


# Set environment variables
ENV TRANSLATE_SERVICE_URL=https://68d0-34-147-53-70.ngrok.io
ENV CONCURRENT_AMOUNT=2
ENV NODE_ENV=production

# Expose port 5001
EXPOSE 5001


# Run the app with npm
CMD [ "npm", "run", "start" ]
