import { Injectable } from '@angular/core';
import { HttpService } from '../../common/http/http.service';
import { PostCommentRequestPayload } from './post-comment-request.payload'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class PostCommentService extends HttpService {
    constructor() {
        super();
        this.url = `${this.origin}post-comment`;
    }
    
}
