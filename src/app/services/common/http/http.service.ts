import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import * as authConfig from '../../../core/_config/auth.config';
import { Configuration } from '../utility/app-configuration.service';
import { ServiceLocator } from '../utility/service-locator.service';
import { BaseResponse } from './base-response.model';
import { RequestPayload } from './request-payload.model';
@Injectable()
export class HttpService<T = any> {
    protected httpClient = ServiceLocator.injector.get(HttpClient);
    protected configuration = ServiceLocator.injector.get(Configuration).configuration;

    // localhost
    // https
    public origin = 'https://localhost:44351/';
    // http
    // public origin = 'http://localhost:6688/';

    // server 1
    // https
    // public origin = 'https://192.168.31.162:4445/';
    // http
    // public origin = 'http://116.99.32.130:35375/';

    // server 2
    // https
    // public origin = 'http://21.159.161.86:6688/';
    // http
    // public origin = 'http://117.6.251.179:4444/';

    public url = '';
    public authConfig: any;
    public isLoading = false;

    public isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

    static _pendingRequest = 0;
    private _loginTab = null;

    constructor() {
        this.authConfig = authConfig.Auth_CONFIG;
    }

    public select(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<T[]> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<T[]>(this.url,
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public count(requestPayload?: RequestPayload, isSpinner?: boolean): Observable<number> {
        requestPayload = !requestPayload ? new RequestPayload() : requestPayload;
        return this.intercept(this.httpClient.get<number>(this.url + '/count',
            { observe: 'response', headers: this.getHeaders(), params: requestPayload.toParams() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public selectById(id: string, isSpinner?: boolean): Observable<T> {
        return this.intercept(this.httpClient.get<T>(`${this.url}/${id}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public insert(body: BaseResponse, isSpinner?: boolean): Observable<T> {
        return this.intercept(this.httpClient.post<T>(this.url, JSON.stringify(body),
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public update(body: BaseResponse, isSpinner?: boolean): Observable<T> {
        return this.intercept(this.httpClient.put<T>(`${this.url}/${body.id}`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public merge(body: BaseResponse, isSpinner?: boolean, params?: any): Observable<T> {
        return this.intercept(this.httpClient.post<T>(`${this.url}/merge`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders(), params: this.toParams(params) }), isSpinner)
            .pipe(map(r => r.body));
    }

    public bulkInsert(body: BaseResponse[], isSpinner?: boolean): Observable<T> {
        return this.intercept(this.httpClient.post<T>(`${this.url}/bulk-insert`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public bulkUpdate(body: BaseResponse[], isSpinner?: boolean): Observable<T> {
        return this.intercept(this.httpClient.put<T>(`${this.url}/bulk-update`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public bulkMerge(body: BaseResponse[], isSpinner?: boolean): Observable<T> {
        return this.intercept(this.httpClient.post<T>(`${this.url}/bulk-merge`,
            JSON.stringify(body), { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public delete(id: string, isSpinner?: boolean): Observable<boolean> {
        return this.intercept(this.httpClient.delete(`${this.url}/${id}`,
            { observe: 'response', headers: this.getHeaders() }), isSpinner)
            .pipe(map(r => r.body));
    }

    public intercept(observable: Observable<HttpResponse<any>>, isSpinner?: boolean): Observable<HttpResponse<any>> {
        if (isSpinner == null || isSpinner === undefined) { isSpinner = true; }
        if (isSpinner) { this.showSpinner(); }
        return observable
            .pipe(tap(() => {
                if (window.window.name === 'epo-windowlogin') {
                    window.close();
                }
            }, (err: HttpErrorResponse) => {
                // Handle when error occured
                this.throwException(err);
            }), finalize(() => {
                if (isSpinner) { this.hideSpinner(); }
            }));
    }

    private throwException(error: HttpErrorResponse): void {
        console.log(error);
        switch (error.status) {
            case 0:
                // window.location.href = origin + '/error/error-v1';
                break;
            case 401:
                // Unauthorized access
                this.confirmToRelogin();
                console.log(error.error);
                break;
            default:
                console.log(error.error);
                break;
        }
    }

    public getHeaders(): HttpHeaders {
        const headers = new HttpHeaders({
            'content-type': 'application/json; charset=utf-8',
            //'id-token': this.getCookie(this.authConfig.accessToken),
            Authorization: 'Bearer ' + this.getCookie(this.authConfig.accessToken)
        });
        return headers;
    }

    protected showSpinner() {
        HttpService._pendingRequest++;
        if (!document.body.classList.contains('m-page--loading-non-block')) {
            document.body.classList.add('m-page--loading-non-block');
        }
        this.isLoading = true;
        this.isLoadingSubject.next(true);
    }

    protected hideSpinner() {
        HttpService._pendingRequest--;
        if (HttpService._pendingRequest === 0 && document.body.classList.contains('m-page--loading-non-block')) {
            document.body.classList.remove('m-page--loading-non-block');
        }
        this.isLoading = false;
        this.isLoadingSubject.next(false);
    }

    protected toParams(objParams: any): HttpParams {
        let params = new HttpParams();

        for (const l1PropertyName in objParams) {
            if (objParams.hasOwnProperty(l1PropertyName) && objParams[l1PropertyName.toString()] != null) {
                const l1Property = objParams[l1PropertyName.toString()];
                if (typeof l1Property === 'object') {
                    if (Array.isArray(l1Property)) {
                        for (const item of l1Property) {
                            params = params.append(l1PropertyName, item);
                        }
                    } else {
                        for (const l2PropertyName in l1Property) {
                            if (l1Property.hasOwnProperty(l2PropertyName) && l1Property[l2PropertyName.toString()] != null) {
                                const level2Property = l1Property[l2PropertyName.toString()];
                                params = params.set(l1PropertyName + '.' + l2PropertyName, level2Property);
                            }
                        }
                    }
                } else {
                    if (l1Property !== '' && l1Property !== null && l1Property !== undefined) {
                        params = params.set(l1PropertyName, l1Property);
                    }
                }
            }
        }

        return params;
    }

    /**
     * Get cookies by name
     */
    public getCookie(name: string): string {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (const item of ca) {
            let c = item;
            while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
            if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
        }
        return '';
    }
    
    /**
     * Set cookies by name
     */
    public setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    /**
     * Delete cookies by name
     */
    public deleteCookie(name) {
        this.setCookie(name, '', -1);
    }

    /**
     * Delete all cookie
     */
	public deleteAllCookies() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	}


    private confirmToRelogin(): void {
        if (!this._loginTab || this._loginTab.closed) {
            const result = confirm('Phiên đăng nhập hết hạn. Màn hình làm việc sẽ được giữ lại. Bạn có muốn mở tab mới để đăng nhập lại.');
            if (result) {
                this._loginTab = window.open(window.location.origin + '/auth/login', 'epo-windowlogin');
            }
        }
    }
}
