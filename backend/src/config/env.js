require('dotenv').config();

if (!process.env.NOTION_TOKEN) {
  throw new Error('NOTION_TOKEN manquant dans backend/.env');
}

module.exports = {
  port: process.env.PORT || 3000,
  timezone: 'Indian/Antananarivo', // UTC+3
};