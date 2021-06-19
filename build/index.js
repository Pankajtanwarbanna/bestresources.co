global.__basePath   = process.cwd() + '/';
const app           = require(__basePath + 'app/app.js');
const env           = process.env.NODE_ENV;
const config        = require(__basePath + `app/config/config.${env}.json`);
const PORT          = config.server.port;

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`)
})