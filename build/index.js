global.__basePath   = process.cwd() + '/';
const app           = require(__basePath + 'app/app.js');
const config        = require(__basePath + `app/core/configuration`);
const PORT          = config.server.port;

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`)
})