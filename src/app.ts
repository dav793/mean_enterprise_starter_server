import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as cors from 'cors';

const expressJwt = require('express-jwt');

// routes
import IndexRouter from './shared/routes/index';
import UserRouter from './modules/user/user/user-router';
import UserPublicRouter from './modules/user/user/user-public-router';
import UserGroupRouter from './modules/user/user-group/user-group-router';
import RoleRouter from './modules/user/role/role-router';
import PermissionRouter from './modules/user/permission/permission-router';
import ContactRouter from './modules/contact/contact-router';
import RelationRouter from './modules/relation/relation-router';
import TestRouter from './modules/user/test/test-router';
import Test2Router from './modules/user/test/test2-router';

import Config from './shared/lib/config';

const logger = require('./shared/lib/winston');

class App {

    // ref to Express instance
    public express: express.Application;

    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.database();
        this.middleware();
        this.authentication();
        this.routes();
        this.handleErrors();    // this needs to be the last function called
    }

    // Configure database connection.
    private database(): void {
        if (Config.get('NODE_ENV', true) === 'test')
            return;

        let url;
        if (Config.get('DB').AUTH) {
            url = `mongodb://${Config.get('DB').USER}:${Config.get('DB').PWD}@${Config.get('DB').HOST}:${Config.get('DB').PORT}/${Config.get('DB').NAME}`;
        } else {
            url = `mongodb://${Config.get('DB').HOST}:${Config.get('DB').PORT}/${Config.get('DB').NAME}`;
        }
        mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log('Connection to DB server established');
        });
    }

    // Configure Express middleware.
    private middleware(): void {

        // third party middleware
        this.express.use(cors());
        this.express.use(morgan('dev', { stream: logger.stream }));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        // application-level middleware

        // const hostname = 'localhost';
        // const port = Config.get('HTTP-WS').PORT;
        // let protocol = 'http';
        // if ( Config.get('HTTP-WS').SSL.IS_ENABLED )
        //     protocol = 'https';

        // this.express.use(cors({
        //     origin: `${protocol}://${hostname}:4200`,
        //     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        // }));

        // this.express.use((req, res, next) => {
        //     res.set({
        //         'Content-Security-Policy': `default-src 'self' '${protocol}://${hostname}:${port}}'`
        //     });
        //     next();
        // });
    }

    // Protect API endpoints
    private authentication(): void {
        require('./shared/lib/passport');      // required here for it to have access to the User model from mongoose
        this.express.use(passport.initialize());

        const authenticate = expressJwt({secret : Config.get('HTTP-WS').AUTH.JWT_SECRET});

        // User Module
        this.express.use('/api/users',          authenticate, (req, res, next) => { next(); });
        this.express.use('/api/userGroups',     authenticate, (req, res, next) => { next(); });
        this.express.use('/api/roles',          authenticate, (req, res, next) => { next(); });
        this.express.use('/api/permissions',    authenticate, (req, res, next) => { next(); });
        this.express.use('/api/contacts',       authenticate, (req, res, next) => { next(); });
        this.express.use('/api/relations',       authenticate, (req, res, next) => { next(); });
        this.express.use('/api/tests',          authenticate, (req, res, next) => { next(); });
        this.express.use('/api/tests2',         authenticate, (req, res, next) => { next(); });
    }

    // Configure API endpoints.
    private routes(): void {
        this.express.use('/',               IndexRouter);

        // User Module
        this.express.use('/api/public/users',   UserPublicRouter);
        this.express.use('/api/users',          UserRouter);
        this.express.use('/api/userGroups',     UserGroupRouter);
        this.express.use('/api/roles',          RoleRouter);
        this.express.use('/api/permissions',    PermissionRouter);
        this.express.use('/api/contacts',       ContactRouter);
        this.express.use('/api/relations',      RelationRouter);
        this.express.use('/api/tests',          TestRouter);
        this.express.use('/api/tests2',         Test2Router);

        // 404 response
        this.express.all('*', (req: any, res: any) => {
            console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
            res.sendStatus(404);
        });
    }

    private handleErrors(): void {
        this.express.use((err, req, res, next) => {

            logger.error(err.stack);

            if (res.headersSent)
                return next(err);    // delegate to default error-handler if response has already begun being sent

            switch (err.name) {
                case 'UnauthorizedError':   // thrown when no authorization header is found in a protected route

                    res.status(401).send(err.message);  // 401 - unauthorized

                    break;
                default:

                    if (Config.get('NODE_ENV', true) === 'production')
                        res.status(500).send(err.message);
                    else
                        res.status(500).send(err.stack);

                    break;
            }
        });
    }

}

export default new App().express;
