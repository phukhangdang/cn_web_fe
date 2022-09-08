import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as signalR from "@microsoft/signalr";
import { PostCommentService } from "../../../services/modules/post-comment/post-comment.service";
import { PostLikeService } from "../../../services/modules/post-like/post-like.service";
import { PostRequestPayload } from "../../../services/modules/post/post-request.payload";
import { PostService } from "../../../services/modules/post/post.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
})
export class PostComponent implements OnInit {
  public postData: any = [];
  public newPost: any = {};
  public isShowCreatePost: boolean = false;

  private _hubConnection: signalR.HubConnection;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: Router,
    private postService: PostService,
    private postCommentService: PostCommentService,
    private postLikeService: PostLikeService
  ) {}

  ngOnInit() {
    this.initData();
    this.setConnection();
  }

  setConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(`${this.postService.origin}signalR`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
    this._hubConnection
      .start()
      .then(() => console.log("Connection started!"))
      .catch((err) => console.log("Error while establishing connection :("));

    this._hubConnection.on("BroadcastComment", (data: any) => {
      this.addCommentToPost(data);
      console.log(data);
    });
  }

  addCommentToPost(comment: any) {
    var postIndex = this.postData.findIndex((e) => {
      return e.id == comment.postId;
    });
    console.log(postIndex);
    if (postIndex >= 0) {
      this.postData[postIndex].comments.push(comment);
    }
    this.cdr.detectChanges();
  }

  initData() {
    var postRequest = new PostRequestPayload();
    this.postService.select(postRequest).subscribe((res) => {
      this.postData = res;
      this.postData.forEach((element) => {
        element.isShowComment = true;
      });
      this.cdr.detectChanges();
    });
  }

  public submitPost(): void {
    this.postService.merge(this.newPost).subscribe((res) => {
      this.isShowCreatePost = false;
      this.newPost = {};
      this.initData();
    });
  }

  public submitComment(e, post): void {
    if (e.code == "Enter") {
      if (e.target.value && e.target.value != null && e.target.value != "")
        var commentRequest: any = {};
      commentRequest.postId = post.id;
      commentRequest.content = e.target.value;
      this.postCommentService.merge(commentRequest).subscribe((res) => {
        this.initData();
        console.log(res);
      });
    }
  }

  public submitLike(post: any): void {
    var likeRequest: any = {};
    likeRequest.postId = post.id;
    this.postLikeService.merge(likeRequest).subscribe((res) => {
      this.initData();
      console.log(res);
    });
  }

  public onBtnShowCreatePostClick() {
    this.isShowCreatePost = !this.isShowCreatePost;
  }

  public onBtnShowCommnetClick(post: any) {
    post.isShowComment = !post.isShowComment;
  }

  public viewProfile(userId: any) {
    this.route.navigate([`/apps/user-profile/${userId}`]);
  }

  public onUploadedFile(file: any) {
    this.newPost.fileId = file.id;
  }
}
