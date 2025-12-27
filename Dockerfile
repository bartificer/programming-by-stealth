# Base this image on the official Docker image for Ruby
FROM ruby:3.3

# Install Node.js (needed for some Jekyll plugins)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install bundler
RUN gem install bundler

# Set working directory to project root
WORKDIR /site

# Smart entrypoint
COPY <<'EOF' /usr/local/bin/docker-entrypoint.sh
#!/bin/bash
set -e

# Only install/update if needed
if [ -f "Gemfile" ]; then
  if ! bundle check > /dev/null 2>&1; then
    echo "📦 Installing gems..."
    bundle install
  fi
fi

# Execute the main command
exec "$@"
EOF

# make the script executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose Jekyll's default port
EXPOSE 4000

# Set the entrypoint to the script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Default command
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]
