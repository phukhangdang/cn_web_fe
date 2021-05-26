import { Injectable } from '@angular/core';
import { HttpService } from '../../common/http/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../services/common/http/base-response.model';
@Injectable({
    providedIn: 'root'
})

export class UserService<T = any> extends HttpService {
    constructor() {
        super();
        this.url = `${this.origin}user`;
    }

    public create(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<T> {
        return this.intercept(this.httpClient.post<T>(`${this.url}/create`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }
    
}
