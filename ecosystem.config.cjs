module.exports = {
    apps: [
        {
            name: 'my_app',
            script: './dist/src/app.js',
            watch: false,
            ignore_watch: ['database'],
            autorestart: true,
            // ----------------------------------------------------
            // when I try to inject a .env it's just being ignored:
            // ----------------------------------------------------
            env: {
                PORT: 3000,
                ENV_PATH: "./.env.production",
            }
        }
    ]
};