import { Injectable } from '@angular/core';
import { HttpService } from '../../common/http/http.service';
import { PostLikeRequestPayload } from './post-like-request.payload';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class PostLikeService extends HttpService {
    constructor() {
        super();
        this.url = `${this.origin}post-like`;
    }
    
}
