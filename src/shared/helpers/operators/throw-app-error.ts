import {throwError} from 'rxjs';
import {ErrorName} from '../../enums/errors';

/**
 * this is just a higher order function that wraps around the throwError operator
 */
export function throwAppError(name: ErrorName, text: string) {
    return throwError(e => {
        const err = new Error(text);
        err.name = name;
        return throwError(err);
    });
}
