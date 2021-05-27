import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/modules/user/user.service';
import { PostCommentService } from '../../../services/modules/post-comment/post-comment.service';
import { PostLikeService } from '../../../services/modules/post-like/post-like.service';
import { PostRequestPayload } from '../../../services/modules/post/post-request.payload';
import { PostService } from '../../../services/modules/post/post.service';
import { UserRequestPayload } from '../../../services/modules/user/user-request.payload';
import { FollowedService } from '../../../services/modules/followed/followed.service';
import { FollowerService } from '../../../services/modules/follower/follower.service';
import { forkJoin } from 'rxjs';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})

export class UserProfileComponent implements OnInit {
  public postData: any = [];
  public newPost: any = {};
  public userData: any = {};
  public isShowCreatePost: boolean;
  private _hubConnection: signalR.HubConnection;

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
    this.initData();
    this.setConnection();
  }

  initData() {
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
    });
  }

  setConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl("https://localhost:44352/signalR", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this._hubConnection.on('BroadcastComment', (data: any) => {
      this.addCommentToPost(data);
      console.log(data);
    });
  }

  addCommentToPost(comment: any) {
    var postIndex = this.postData.findIndex(e => {
      return e.id == comment.postId;
    });
    console.log(postIndex);
    if (postIndex >= 0) {
      this.postData[postIndex].comments.push(comment);
    }
    this.cdr.detectChanges();
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
      this.initData();
    });
  }

  public submitComment(e, post): void {
    if (e.code == "Enter") {
      if (e.target.value && e.target.value != null && e.target.value != '')
      var commentRequest: any = {};
      commentRequest.postId = post.id;
      commentRequest.content = e.target.value;
      this.postCommentService.merge(commentRequest).subscribe(res => {
        this.initData();
        console.log(res);
      });
    }
  }

  public submitLike(post: any): void {
    var likeRequest: any = {};
      likeRequest.postId = post.id;
      this.postLikeService.merge(likeRequest).subscribe(res => {
        this.initData();
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
      this.initData();
    });
  }

  viewProfile(userId: any) {
    this.route.navigate([`/apps/user-profile/${userId}`]);
  }
  
}
