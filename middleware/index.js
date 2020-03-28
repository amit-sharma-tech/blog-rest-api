const morgan =   require('morgan');
const bodyParser =   require('body-parser');
const compression =   require('compression');
const helmet =   require('helmet');
const {ENVIRONMENT} = require('./configuration/index');
 /* const isDev = process.env.NODE_ENV === 'development';
 const isProd = process.env.NODE_ENV === 'production'; */
export default app => {
    if (isProd) {
        app.use(compression());
        app.use(helmet());
    }
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    if (isDev) {
        app.use(morgan('dev'));
    }
};