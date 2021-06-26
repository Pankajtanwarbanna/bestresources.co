const env           = process.env.NODE_ENV || 'development';
const config        = require(__basePath + `app/config/config.${env}.json`);

module.exports      = config;