import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.metal.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const app = express();
const server = app.listen(PORT, () => {
    console.log(`server connected on port: ${server.adress().PORT}`)
});

server.on('error', error => console.log(`Error en el servidor: ${error}`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(require('./routes/main'));

export default app;