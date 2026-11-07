require('./env'); // charge dotenv avant de créer le client
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

module.exports = { notion };