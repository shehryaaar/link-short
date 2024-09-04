const configuration = {
    env: process.env.NEXT_PUBLIC_NODE_ENV,
    github: {
        repository: process.env.NEXT_PUBLIC_GITHUB_REPOSITORY,
    },
    port: process.env.NEXT_PUBLIC_PORT,
    version: process.env.NEXT_PUBLIC_VERSION,
    mongoose: {
        url: process.env.NEXT_PUBLIC_MONGODB_URL,
    },
    redis: {
        url: process.env.NEXT_PUBLIC_REDIS_URL,
    },
    timeout: process.env.NEXT_PUBLIC_TIMEOUT_IN_SECONDS,
    cache: {
        timeout: process.env.NEXT_PUBLIC_CACHE_TTL_IN_SECONDS,
    },
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
};

export default configuration;
