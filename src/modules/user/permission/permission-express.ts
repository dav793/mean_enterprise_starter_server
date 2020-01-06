import { NextFunction, Request, Response } from 'express';
import { of } from "rxjs";

import { IResourcePermissions } from '../role/role-interface';
import { ResourceName } from '../../../shared/enums/resources';
import { PermissionAction, PermissionLevel } from './permission-enums';
import { permissionControllerSingleton as PermissionController } from './permission-controller';
import { requestAuthenticationModuleSingleton as RequestAuthenticationModule } from './req-auth-module';
import { requestMetadataSingleton as ReqMetadataFactory } from '../../../shared/helpers/request-metadata-factory';

import SocketIOServer from '../../../shared/lib/socket.io/socket';

class PermissionExpressLayer {
    constructor() { }
    /*
        EFE: middleware that authorizes a certain user/resource/action/level operation.
                if operation is successful 
                    allows middleware pipeline to continue
                else 
                    error response with error code 403 Forbidden is sent
        REQ: 
            resource: the resource that someone wants access to
            action: the action that someone wants to do with the resource
            level: the level of authorization requested
        MOD: ---
     */
    authorize(resource: ResourceName, action: PermissionAction, level: PermissionLevel) {
        return (req: Request, res: Response, next: NextFunction) => {

            const uid = req.user._id;
            const meta = ReqMetadataFactory.create(req);
            let preStep = of(true);

            if (level === PermissionLevel.REQUEST_AUTHENTICATION) {
                if (meta && meta.clientId) {
                    SocketIOServer.sendAuthenticationRequest(meta.clientId, uid);
                    preStep = RequestAuthenticationModule.createAttemptListener(meta.clientId, uid);
                }
                else {
                    console.error(`request metadata is malformed or missing`);
                    preStep = of(false);
                }
            }

            preStep.subscribe(preStepResult => {

                if (preStepResult) {
                    PermissionController.getUserPermissions(uid)
                        .subscribe(
                            (perms: IResourcePermissions[]) => {
                                const perm = PermissionController.getResourceActionPermission(perms, resource, action);
                                if (perm.level >= level)
                                    next();
                                else
                                    res.sendStatus(403);
                            },
                            err => next(err)
                        );
                }
                else
                    res.sendStatus(403);

            });

        };
    }

    public getPermissionByUserId(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;

        PermissionController.getUserPermissions(userId).subscribe(
            (perms: IResourcePermissions[]) => res.status(200).json(perms),
            err => next(err)
        );
    }

    public getPermissionOverResourceByUserId(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        const resource = req.params.resource;

        PermissionController.getUserPermissions(userId).subscribe(
            (perms: IResourcePermissions[]) => {
                const resourcePerms = PermissionController.getResourcePermissions(perms, resource);
                res.status(200).json(resourcePerms);
            },
            err => next(err)
        );
    }

    public getPermissionToActionOverResourceByUserId(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        const resource = req.params.resource;
        const action = req.params.action;

        PermissionController.getUserPermissions(userId).subscribe(
            (perms: IResourcePermissions[]) => {
                const actionPerm = PermissionController.getResourceActionPermission(perms, resource, action);
                res.status(200).json(actionPerm);
            },
            err => next(err)
        );
    }
}

export const permissionExpressLayerSingleton = new PermissionExpressLayer();
export const authorize = permissionExpressLayerSingleton.authorize;
