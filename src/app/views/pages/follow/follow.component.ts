import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/modules/user/user.service';
import { UserRequestPayload } from 'app/services/modules/user/user-request.payload';
import { FollowedService } from 'app/services/modules/followed/followed.service';
import { FollowerService } from 'app/services/modules/follower/follower.service';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html'
})

export class FollowComponent implements OnInit {
  
  public userData: any = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private route: Router,
    private userService: UserService,
    private followerService: FollowerService,
    private followedService: FollowedService,
    ) {
    }

  ngOnInit() {
    this.initUser();
  }

  initUser() {
    var userRequest = new UserRequestPayload();
    this.userService.select(userRequest).subscribe(res => {
      this.userData = res;
      this.cdr.detectChanges();
    })
  }

  public onBtnFollowClick(userData: any) {
    var user = JSON.parse(this.userService.getCookie("UserInfo"));
    var follower: any = {};
    follower.userId = userData.id;
    follower.followerId = user.id;
    
    var followed: any = {};
    followed.userId = user.id;
    followed.followedId = userData.id;

    this.followedService.merge(followed).subscribe(res => {
      this.followerService.merge(follower).subscribe(res => {
        
      });
      // sucesss
      this.ngOnInit();
      this.cdr.detectChanges();
    })
  }

  viewProfile(user: any) {
    this.route.navigate([`/apps/user-profile/${user.id}`]);
  }

}
