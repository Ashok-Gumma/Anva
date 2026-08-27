module.exports = {
  apps: [
    {
      name: "anva-backend",
      script: "./backend/src/server.js",
      node_args: "--max-http-header-size=65536",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
    },
  ],
};
