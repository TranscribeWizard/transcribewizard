# wget (have run)
 apt-get update && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists/*


# miniconda (have run)

wget -q https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh && \
    /bin/bash /tmp/miniconda.sh -bfp /usr/local && \
    rm -rf /tmp/miniconda.sh && \
    conda clean -ay && \
    ln -s /usr/local/etc/profile.d/conda.sh /etc/profile.d/conda.sh && \
    echo ". /usr/local/etc/profile.d/conda.sh" >> ~/.bashrc && \
    echo "conda activate base" >> ~/.bashrc

# curl (have run)
apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# nvm (have run)

 curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
    && nvm install 18.16.0 \
    && nvm alias default 18.16.0 \
    && nvm use default \
    && npm install -g npm \
    && rm -rf /var/lib/apt/lists/*

# git (uses run)

apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*


# whisper installation 

# ffmpeg 
sudo apt update && sudo apt install ffmpeg -y

# rust 
curl https://sh.rustup.rs -sSf | sh -s -- -y
pip install -U setuptools-rust setuptools

# whisper-ctranslate2

pip install -U whisper-ctranslate2

# yt-dlp 
 curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
 chmod a+rx /usr/local/bin/yt-dlp

# cloning code 

git clone  https://github.com/TranscribeWizard/transcribewizard.git ./
rm -rf client 
mv server app

cd app
touch .env

echo "TRANSLATE_SERVICE_URL=https://68d0-34-147-53-70.ngrok.io" >> .env
echo "CONCURRENT_AMOUNT=2" >> .env
echo "NODE_ENV=production" >> .env

# npm install 
npm install -g http-server pm2

npm install 

# pm2 start npm -- start

pm2 start npm -- start
