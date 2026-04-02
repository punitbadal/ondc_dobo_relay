module.exports = {
    apps: [
        {
            name: 'ondc-relay',
            script: 'server.js',
            instances: 'max',                    // Auto-scale to number of CPU cores
            exec_mode: 'cluster',                // Cluster mode for zero-downtime
            watch: false,
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
                PORT: 4000
            },
            error_file: './logs/error.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true,
            // Auto-restart on crash
            autorestart: true,
            // Graceful shutdown
            shutdown_with_message: true,
            kill_timeout: 3000,
        }
    ]
};