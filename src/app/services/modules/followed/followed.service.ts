import { Injectable } from '@angular/core';
import { HttpService } from '../../common/http/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class FollowedService extends HttpService {
    constructor() {
        super();
        this.url = `${this.origin}followed`;
    }
    
}
