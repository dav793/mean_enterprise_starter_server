import { Request, Response, NextFunction } from 'express';
import { userGroupControllerSingleton as UserGroupController } from './user-group-controller';
import { IUserGroupModel } from './user-group-model';
import { IUserGroupCreateBody, IUserGroupUpdateBody } from './user-group-interface';
import { requestMetadataSingleton as ReqMetadataFactory } from '../../../shared/helpers/request-metadata-factory';

class UserGroupExpressLayer {
    constructor() { }

    public getAllUserGroups(req: Request, res: Response, next: NextFunction) {
        UserGroupController.getUserGroups().subscribe(
            (userGroups: IUserGroupModel[]) => res.status(200).json(userGroups),
            err => next(err)
        );
    }

    public getUserGroup(req: Request, res: Response, next: NextFunction) {
        const groupId = req.params.id;
        UserGroupController.getUserGroupById(groupId).subscribe(
            (group: IUserGroupModel) => res.status(200).json(group),
            err => next(err)
        );
    }

    public createUserGroup(req: Request, res: Response, next: NextFunction) {
        const groupData: IUserGroupCreateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        UserGroupController.createUserGroup(groupData, meta).subscribe(
            (group: IUserGroupModel) => res.status(200).json(group),
            err => next(err)
        );
    }

    public updateUserGroup(req: Request, res: Response, next: NextFunction) {
        const groupId = req.params.id;
        const groupData: IUserGroupUpdateBody = req.body;
        const meta = ReqMetadataFactory.create(req);

        UserGroupController.updateUserGroup(groupId, groupData, meta).subscribe(
            (group: IUserGroupModel) => res.status(200).json(group),
            err => next(err)
        );
    }

    public deleteUserGroup(req: Request, res: Response, next: NextFunction) {

        const userGroupId = req.params.id;
        const meta = ReqMetadataFactory.create(req);

        UserGroupController.deleteUserGroup(userGroupId, meta).subscribe(
            (result: boolean) => res.status(200).json(result),
            err => next(err)
        );
    }
}

export const userGroupExpressLayerSingleton = new UserGroupExpressLayer();
