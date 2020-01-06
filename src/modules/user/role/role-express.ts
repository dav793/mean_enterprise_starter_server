import { Request, Response, NextFunction } from 'express';

import { roleControllerSingleton as RoleController } from './role-controller';
import { IRoleModel } from './role-model';
import { IRoleCreateBody, IRoleUpdateBody } from './role-interface';
import { requestMetadataSingleton as ReqMetadataFactory } from '../../../shared/helpers/request-metadata-factory';

class RoleExpressLayer {
    constructor() { }

    public getAllRoles(req: Request, res: Response, next: NextFunction) {
        RoleController.getRoles().subscribe(
            (roles: IRoleModel[]) => res.status(200).json(roles),
            err => next(err)
        );
    }

    public getRoleById(req: Request, res: Response, next: NextFunction) {
        const roleId = req.params.id;

        RoleController.getRoleById(roleId).subscribe(
            (role: IRoleModel) => res.status(200).json(role),
            err => next(err)
        );
    }

    public createRole(req: Request, res: Response, next: NextFunction) {
        const roleData: IRoleCreateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        RoleController.createRole(roleData, meta).subscribe(
            (role: IRoleModel) => res.status(200).json(role),
            err => next(err)
        );
    }

    public updateRole(req: Request, res: Response, next: NextFunction) {
        const roleId = req.params.id;
        const roleData: IRoleUpdateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        RoleController.updateRole(roleId, roleData, meta).subscribe(
            (role: IRoleModel) => res.status(200).json(role),
            err => next(err)
        );
    }

    public deleteRole(req: Request, res: Response, next: NextFunction) {
        const roleId = req.params.id;
        const meta = ReqMetadataFactory.create(req);

        RoleController.deleteRole(roleId, meta).subscribe(
            (result: boolean) => res.status(200).json(result),
            err => next(err)
        );
    }
}

export const RoleExpressLayerSingleton = new RoleExpressLayer();
