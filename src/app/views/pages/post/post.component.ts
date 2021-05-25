import { ChangeDetectorRef, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PostRequestPayload } from 'app/services/modules/post/post-request.payload';
import { PostService } from '../../../services/modules/post/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html'
})

export class PostComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private route: Router,
    private postService: PostService,
    ) { }

  ngOnInit() {
    var postRequest = new PostRequestPayload();
    this.postService.select(postRequest).subscribe(res => {
      console.log(res);
    })
  }

}
