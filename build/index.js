global.__basePath   = process.cwd() + '/';
const app           = require(__basePath + 'app/app.js');
const config        = require(__basePath + 'app/config/config.development.json');
const PORT          = config.server.port || 8080;

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`)
})