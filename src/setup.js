const inquirer = require('inquirer');
const fs = require('fs-extra');
const strings = require(`${__dirname}/strings`);

const URLRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const PortRegex = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])/;
const IPRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

fs.exists(`${__dirname}/data/config.json`).then(exists => {
    if (exists) {
        inquirer.prompt({ name: 'confirmation', type: 'confirm', message: strings.PROMPTS.EXISTS, default: false }).then(results => {
            if (results['confirmation']) return setup();
            else return console.log(strings.PROMPTS.UNDERSTOOD);
        })
    }
    else setup();
})

function setup() {
    inquirer.prompt([
        // RethinkDB
        { name: 'rethink-host', type: 'input', message: strings.PROMPTS.RETHINKDB_HOST, validate: (input) => ((URLRegex.test(input) || IPRegex.test(input) || input === 'localhost') || strings.VALIDATION.RETHINKDB_HOST), default: 'localhost' },
        { name: 'rethink-port', type: 'input', message: strings.PROMPTS.RETHINKDB_PORT, validate: (input) => PortRegex.test(input) || strings.VALIDATION.RETHINKDB_PORT, default: 28015 },
        { name: 'rethink-user', type: 'input', message: strings.PROMPTS.RETHINKDB_USER, default: 'admin' },
        { name: 'rethink-password', type: 'password', mask: true, message: strings.PROMPTS.RETHINKDB_PASSWORD },
        { name: 'rethink-db', type: 'input', message: strings.PROMPTS.RETHINKDB_DB },

        // Server Ports
        { name: 'server-port', type: 'input', message: strings.PROMPTS.SERVER_PORT, validate: (input) => PortRegex.test(input) || strings.VALIDATION.SERVER_PORT, default: 80 },
        { name: 'server-backend-port', type: 'input', message: strings.PROMPTS.BACK_SERVER_PORT, validate: (input) => PortRegex.test(input) || strings.VALIDATION.BACK_SERVER_PORT, default: 8080 },

        // Bcrypt salt
        { name: 'bcrypt-salt', type: 'number', message: strings.PROMPTS.BCRYPT, default: 10 },

        // URLs
        { name: 'url-front', type: 'input', message: strings.PROMPTS.URL_FRONT, validate: (input) => URLRegex.test(input) || input.startsWith('localhost') || strings.VALIDATION.VALID_URL, default: 'localhost' },
        { name: 'url-back', type: 'input', message: strings.PROMPTS.URL_BACK, validate: (input) => URLRegex.test(input) || input.startsWith('localhost') || strings.VALIDATION.VALID_URL, default: 'localhost:8080' },

        // Shortlink length
        { name: 'length', type: 'number', message: strings.PROMPTS.SHORTLINK, validate: (input) => (input >= 3) || strings.VALIDATION.SHORTLINK, default: 5 },

        // JWT Secret
        { name: 'jwt', type: 'password', mask: true, message: strings.PROMPTS.JWT, validate: (input) => (input.length >= 5) || strings.VALIDATION.JWT },

        // Registration
        { name: 'register', type: 'input', message: strings.PROMPTS.REGISTER, validate: (input) => typeof input === 'boolean' || strings.VALIDATION.REGISTER, default: true }
    ]).then(inputs => {
        const config = {
            rethink: {
                host: inputs['rethink-host'],
                port: inputs['rethink-port'],
                user: inputs['rethink-user'],
                password: inputs['rethink-password'],
                database: inputs['rethink-db']
            },
            server: {
                port: inputs['server-port'],
                backendPort: inputs['server-backend-port']
            },
            bcrypt: {
                salt: inputs['bcrypt-salt']
            },
            frontURL: inputs['url-front'],
            backURL: inputs['url-back'],
            shortLength: inputs['length'],
            jwtSecret: inputs['jwt']
        };

        try {
            fs.writeFile(`${__dirname}/data/config.json`, JSON.stringify(config)).then(() => console.log(strings.PROMPTS.CONF_WRITTEN));
        } catch (err) {
            console.error(strings.PROMPTS.CONF_ERROR(err));
        }
    });
}