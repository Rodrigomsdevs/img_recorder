const express = require('express');
const port = 3000;
const userRoutes = require('./server/routes/user.route');
const childRoutes = require('./server/routes/filhos.route');
const clientRoutes = require('./server/routes/client.route')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db_condif = require('./server/config/db.config');
const path = require('path');
const fileUpload = require('express-fileupload');


const app = express();
const sessionStore = new MySQLStore(db_condif.db_config);

//configs
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/client/', express.static(path.join(__dirname, '/', 'client')));
app.use(fileUpload());

// Configuração do middleware express-session
app.use(
    session({
        store: sessionStore,
        secret: 'iara.img.work',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Defina como true em produção com HTTPS
    })
);


//rotas
app.use('/', clientRoutes);
app.use('/api/user', userRoutes);
app.use('/api/filhos', childRoutes);

app.listen(port, () => {
    console.log(`Aplicativo ouvindo na porta ${port}`);
});

process.on('uncaughtException', (error) => {
    console.error(`Exceção não capturada: ${error.message}`);
    console.error(error.stack);
});

