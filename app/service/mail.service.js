const MailGun           = require("mailgun-js");
const constant          = require(__basePath + '/app/config/constant');
const config            = require(constant.path.app + 'core/configuration')
const mail              = MailGun({
    apiKey              : config.EMAIL_SERVER.API_KEY, 
    domain              : config.EMAIL_SERVER.DOMAIN
});

exports.hitEmail        = (payload, callback) => {
    let data            = {};
    const event         = payload.event;

    switch(event) {
        case 'auth':
            data = {
                from        : 'Best Resources <hello@bestresources.co>',
                to          : payload.email,
                subject     : 'Magic Link - Bestresources.co',
                text        : 'Hey 👋, You have requested us to send a magic link to automatically sign in to Bestresources.co, here it is.' + payload.link +'Thanks Your friends at Bestresources.co',
                html        : 'Hey 👋, <br><br> You have requested us to send a magic link to automatically sign in to Bestresources.co, here it is. <br><br><a href="' + payload.link + '">' + payload.link +'</a><br><br>Thanks<br>Your friends at Bestresources.co'  
            };
            break;
        default:
            break;
    }
    mail.messages().send(data, function (error, body) {
        if(error) {
            return callback(error);
        }
        return callback(null, body);
    });
}