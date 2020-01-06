
import * as passport from 'passport';
import { Request, Response, NextFunction } from 'express';

import { userControllerSingleton as UserController } from './user-controller';
import { IUserModel } from './user-model';
import { IUserRegisterBody, IUserUpdateBody } from './user-interface';
import { userDalSingleton as UserDal } from './user-dal';
import { requestMetadataSingleton as ReqMetadataFactory } from '../../../shared/helpers/request-metadata-factory';
import { requestAuthenticationModuleSingleton as RequestAuthenticationModule } from '../permission/req-auth-module';

class UserExpressLayer {

    constructor() { }

    /**
     * middleware to generate a session token for some given user credentials.
     *
     * if successful sends json response with generated token and user id, like so:
     *  {
     *      uid: string,
     *      token: string
     *  }
     *
     * req.body must contain 'username' and 'password' properties:
     * {
     *     username: string,
     *     password: string
     * }
     *
     * this method is here because it cannot be trivially decoupled from the req, res and next Express objects.
     */
    public login(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                res.status(404).json(err);
                return;
            }

            if (user) {
                // user is found
                if (user.deleted) {
                    res.status(401).json(err);  // unauthorized                 ;
                } else {
                    res.status(200).json({
                        uid: user._id.toString(),
                        token: user.generateJwt()
                    });
                }
            }
            else {
                // user is not found
                res.status(401).json(info);     // unauthorized
            }
        })(req, res, next);
    }

    /**
     * middleware used by the client to answer a request for authentication (login) which was initiated by the server (via sockets)
     *
     * if authentication succeeds, any stalled requests waiting for authentication will behave as follows:
     *
     *      if authenticated user is the same as stalled request user,
     *          stalled request continues
     *      otherwise
     *          stalled request fails
     *
     * if authentication fails, any stalled requests waiting for authentication will fail with 403 Forbidden
     *
     * this method is here because it cannot be trivially decoupled from the req, res and next Express objects.
     */
    public replyLogin(req: Request, res: Response, next: NextFunction) {
        const meta = ReqMetadataFactory.create(req);
        if (!meta || !meta.clientId) {
            next(new Error('unidentified client'));
            return;
        }

        passport.authenticate('local', (err, user, info) => {
            if (err)
                RequestAuthenticationModule.fail(401, meta.clientId);
            else if (user) {

                // user is found
                if (user.deleted)
                    RequestAuthenticationModule.fail(401, meta.clientId, user._id.toString());
                else
                    RequestAuthenticationModule.succeed(meta.clientId, user._id.toString());

            }
            else {
                // user is not found
                RequestAuthenticationModule.fail(401, meta.clientId);
            }

            res.status(200).json({});
        })(req, res, next);
    }

    /**
        We can call this method using:

        {
            "username": "andres",
            "firstName": "andres",
            "lastName": "navarrete",
            "email": "andres@gmail.com",
            "roleIds": ['5d4df8199874cf77c7fa8d2a'],
            "password": "andres"
        }
    
    */
    public register(req: Request, res: Response, next: NextFunction) {

        const userData: IUserRegisterBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        UserController.createUser(userData, meta).subscribe(
            (user: IUserModel) => res.status(200).json(user),
            err => next(err)
        );
    }

    public getAllUsers(req: Request, res: Response, next: NextFunction) {
        UserController.getUsers().subscribe(
            (users: IUserModel[]) => res.status(200).json(users),
            err => next(err)
        );
    }

    public getUserById(req: Request, res: Response, next: NextFunction) {

        const userId = req.params.id;

        UserController.getUserById(userId).subscribe(
            (user: IUserModel) => res.status(200).json(user),
            err => next(err)
        );
    }

    public updateUser(req: Request, res: Response, next: NextFunction) {

        const userId = req.params.id;
        const userData: IUserUpdateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        UserController.updateUser(userId, userData, meta).subscribe(
            (user: IUserModel) => res.status(200).json(user),
            err => next(err)
        );
    }

    public createUser(req: Request, res: Response, next: NextFunction) {

        const userData: IUserRegisterBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        UserController.createUser(userData, meta).subscribe(
            (user: IUserModel) => res.status(200).json(user),
            err => next(err)
        );
    }

    public deleteUser(req: Request, res: Response, next: NextFunction) {

        const userId = req.params.id;
        const meta = ReqMetadataFactory.create(req);

        UserController.deleteUser(userId, meta).subscribe(
            (result: boolean) => res.status(200).json(result),
            err => next(err)
        );
    }
}

export const userExpressLayerSingleton = new UserExpressLayer();
