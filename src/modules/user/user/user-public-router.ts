
import { Router } from 'express';
import { userExpressLayerSingleton as UserExpressLayer } from './user-express';

export class UserPublicRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/login', UserExpressLayer.login);
        this.router.post('/replyLogin', UserExpressLayer.replyLogin);
        this.router.post('/register', UserExpressLayer.register);
    }

}

export default new UserPublicRouter().router;
