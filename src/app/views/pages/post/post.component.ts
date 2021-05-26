import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostCommentService } from '../../../services/modules/post-comment/post-comment.service';
import { PostLikeService } from '../../../services/modules/post-like/post-like.service';
import { PostRequestPayload } from '../../../services/modules/post/post-request.payload';
import { PostService } from '../../../services/modules/post/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html'
})

export class PostComponent implements OnInit {
  public postData: any = [];
  public newPost: any = {};
  public isShowCreatePost: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: Router,
    private postService: PostService,
    private postCommentService: PostCommentService,
    private postLikeService: PostLikeService,
    ) {
    }

  ngOnInit() {
    this.initData();
  }

  initData() {
    var postRequest = new PostRequestPayload();
    this.postService.select(postRequest).subscribe(res => {
      this.postData = res;
      this.postData.forEach(element => {
        element.isShowComment = true;
      });
      this.cdr.detectChanges();
    });
  }

  public submitPost(): void {
    this.postService.merge(this.newPost).subscribe(res => {
      this.newPost = {};
      this.ngOnInit();
    });
  }

  public submitComment(e, post): void {
    if (e.code == "Enter") {
      if (e.target.value && e.target.value != null && e.target.value != '')
      var commentRequest: any = {};
      commentRequest.postId = post.id;
      commentRequest.content = e.target.value;
      this.postCommentService.merge(commentRequest).subscribe(res => {
        this.ngOnInit();
        console.log(res);
      });
    }
  }

  public submitLike(post: any): void {
    var likeRequest: any = {};
      likeRequest.postId = post.id;
      this.postLikeService.merge(likeRequest).subscribe(res => {
        this.ngOnInit();
        console.log(res);
      });
  }

  public onBtnShowCreatePostClick() {
    this.isShowCreatePost = !this.isShowCreatePost;
  }

  public onBtnShowCommnetClick(post: any) {
    post.isShowComment = !post.isShowComment;
  }

  viewProfile(userId: any) {
    this.route.navigate([`/apps/user-profile/${userId}`]);
  }

}
