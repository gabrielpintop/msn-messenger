import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.friendId = this.activatedRoute.snapshot.params['uid'];
    this.userService
      .getUserById(this.friendId)
      .valueChanges()
      .subscribe(
        (data: User) => {
          this.friend = data;
        },
        err => {
          console.log(err);
        }
      );
  }

  ngOnInit() {}
}
