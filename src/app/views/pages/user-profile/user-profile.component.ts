import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/modules/user/user.service';
import { PostCommentService } from '../../../services/modules/post-comment/post-comment.service';
import { PostLikeService } from '../../../services/modules/post-like/post-like.service';
import { PostRequestPayload } from '../../../services/modules/post/post-request.payload';
import { PostService } from '../../../services/modules/post/post.service';
import { UserRequestPayload } from 'app/services/modules/user/user-request.payload';
import { FollowedService } from 'app/services/modules/followed/followed.service';
import { FollowerService } from 'app/services/modules/follower/follower.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {
  public postData: any = [];
  public newPost: any = {};
  public userData: any = {};
  public isShowCreatePost: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private postCommentService: PostCommentService,
    private postLikeService: PostLikeService,
    private userService: UserService,
    private followerService: FollowerService,
    private followedService: FollowedService,
    ) {
    }

  ngOnInit() {
    var user = JSON.parse(this.postService.getCookie("UserInfo"));
    this.activatedRoute.params.subscribe(params => {
      if (params.userId) {
        if (params.userId == user.id) {
          this.route.navigate(['apps/user-profile']);
        }
        this.isShowCreatePost = false;
        this.initProfile(params.userId);
      } else {
        this.isShowCreatePost = true;
        this.initMyProfile();
      }
    })
  }

  initUser(id: any) {
    var userRequest = new UserRequestPayload();
    userRequest.id = id;
    this.userService.select(userRequest).subscribe(res => {
      this.userData = res[0];
      this.cdr.detectChanges();
    })
  }

  initMyProfile() {
    var postRequest = new PostRequestPayload();
    var user = JSON.parse(this.postService.getCookie("UserInfo"));
    postRequest.userId = user.id;
    this.initUser(user.id);
    this.postService.select(postRequest).subscribe(res => {
      this.postData = res;
      this.postData.forEach(element => {
        element.isShowComment = true;
      });
      this.cdr.detectChanges();
    });
  }

  initProfile(userId: any) {
    var postRequest = new PostRequestPayload();
    postRequest.userId = userId;
    this.initUser(userId);
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

  public onBtnShowCommnetClick(post: any) {
    post.isShowComment = !post.isShowComment;
  }

  public onBtnFollowClick() {
    var user = JSON.parse(this.postService.getCookie("UserInfo"));
    var follower: any = {};
    follower.userId = this.userData.id;
    follower.followerId = user.id;
    
    var followed: any = {};
    followed.userId = user.id;
    followed.followedId = this.userData.id;

    const requests = [
      this.followedService.merge(followed),
      this.followerService.merge(follower),
    ]

    forkJoin(requests).subscribe(res => {
      this.ngOnInit();
    });
  }
  
}
