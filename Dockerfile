FROM hugomods/hugo:exts

WORKDIR /src

COPY . .

# Accept build argument for base URL (override default /)
ARG SITE_BASE_URL="/"
ENV SITE_BASE_URL=${SITE_BASE_URL}

EXPOSE 1313

# Use environment-provided baseURL; production deploys can pass real domain
CMD hugo server --bind 0.0.0.0 --baseURL "${SITE_BASE_URL}" --appendPort=false --disableFastRender
