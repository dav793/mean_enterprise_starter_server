import { Observable, from, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Role, IRoleModel } from './role-model';
import { IRoleCreateBody, IRoleUpdateBody } from './role-interface';
import { ErrorName } from '../../../shared/enums/errors';

class RoleDal {

    constructor() {}

    getRoles(): Observable<IRoleModel[]> {
        return from( Role.find( {deleted: { $ne: true }} ) );
    }

    getRoleById(roleId: string): Observable<IRoleModel|null> {
        return from( Role.findById(roleId) );
    }

    getRoleByName(roleName: string): Observable<IRoleModel|null> {
        return from(
            Role.findOne({name: roleName})
        );
    }

    createRole(roleData: IRoleCreateBody): Observable<IRoleModel> {
        return from( Role.create(roleData) );
    }

    updateRole(roleId: string, roleData: IRoleUpdateBody): Observable<IRoleModel> {
        return this.getRoleById(roleId).pipe(
            switchMap(role => {
                if (role) {
                    return from( Role.findByIdAndUpdate(roleId, roleData, {new: true}) );
                }
                else {
                    const err = new Error(`role with id ${roleId} does not exist`);
                    err.name = ErrorName.ID_NOT_FOUND;
                    return throwError(err);
                }
            })
        );
    }

    deleteRole(roleId: string): Observable<IRoleModel> {
        return this.updateRole(roleId, { deleted: true } as any);
    }

}

export const roleDalSingleton = new RoleDal();
