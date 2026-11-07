const { port } = require('./src/config/env');
const app = require('./src/app');

app.listen(port, () => console.log(`Serveur lancé sur http://localhost:${port}`));