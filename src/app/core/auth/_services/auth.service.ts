import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '../../../services/common/http/http.service';
import { Account } from '../../../core/auth/_models/account.model';
import { AccountChild } from '../_models/account-child.model';

@Injectable({
    providedIn: 'root'
})

export class AuthService extends HttpService {
    constructor() {
        super();
        this.url = this.origin + 'account';
    }

    public authenticate(body: any, isSpinner?: boolean): Observable<Account> {
        return this.intercept(this.httpClient.post<Account>(this.url + '/authenticate', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public login(body: any, isSpinner?: boolean): Observable<AccountChild> {
        return this.intercept(this.httpClient.post<AccountChild>(this.url + '/login', JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public logout(isSpinner?: boolean): Observable<Account> {
        return this.intercept(this.httpClient.post<Account>(this.url + '/logout', null,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }
}
