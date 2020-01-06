import {Observable, of, Subject} from 'rxjs';
import {first, mergeMap} from "rxjs/operators";

class RequestAuthenticationModule {

    private _authenticationAttempts$: Subject<IAuthenticationAttemptResponse>;

    constructor() {
        this._authenticationAttempts$ = new Subject<IAuthenticationAttemptResponse>();
    }

    /**
     * creates an observable which emits a boolean value the next time a "replyLogin" attempt is made.
     * the observable emits true if and only if ALL these conditions are met:
     *      - the attempt's status is 200 (OK)
     *      - the attempt's clientId matches the one passed to this method as first parameter
     *      - the attempt's userId matches the one passed to this method as second parameter
     *
     * if any of the previous conditions is not met, the observable emits false.
     *
     * @param clientId
     * @param userId
     * @return Observable<boolean>
     */
    createAttemptListener(clientId: string, userId: string): Observable<boolean> {
        return this._authenticationAttempts$.asObservable().pipe(
            first(),
            mergeMap(res => {
                if (
                    res.status && res.status === 200 &&
                    res.clientId && res.clientId === clientId &&
                    res.userId && res.userId === userId
                )
                    return of(true);    // clientId matches AND userId matches AND status is 200
                else
                    return of(false);
            })
        );
    }

    fail(status: number, clientId: string, userId: string = null) {
        this._authenticationAttempts$.next({ status, clientId, userId });
    }

    succeed(clientId: string, userId: string) {
        this._authenticationAttempts$.next({ status: 200, clientId, userId });
    }

}

export interface IAuthenticationAttemptResponse {
    status: number;
    clientId: string;
    userId: string;
}

export const requestAuthenticationModuleSingleton = new RequestAuthenticationModule();
