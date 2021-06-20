const harperive         = require('harperive');
const config            = require(__basePath + `app/core/configuration`);

const databaseConfig    = {
    harperHost          : config.DATABASE.INSTANCE_URL,
    username            : config.DATABASE.INSTANCE_USERNAME,
    password            : config.DATABASE.INSTANCE_PASSWORD,
    schema              : config.DATABASE.INSTANCE_SCHEMA,
};

const Client            = harperive.Client;
const database          = new Client(databaseConfig);

module.exports          = database;
