import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/interfaces/user';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  user: User;
  conversationId: string;
  textMessage: string;
  conversation: any[];
  shake = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    private authenticationService: AuthenticationService
  ) {
    this.friendId = this.activatedRoute.snapshot.params['uid'];

    this.authenticationService.getStatus().subscribe(session => {
      this.userService
        .getUserById(session.uid)
        .valueChanges()
        .subscribe((user: User) => {
          this.user = user;
          this.userService
            .getUserById(this.friendId)
            .valueChanges()
            .subscribe(
              (data: User) => {
                this.friend = data;
                const ids = [this.user.uid, this.friend.uid].sort();
                this.conversationId = ids.join('|');
                this.getConversation();
              },
              err => {
                console.log(err);
              }
            );
        });
    });
  }

  ngOnInit() {}

  sendMessage() {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      seen: false,
      type: 'text'
    };
    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }

  sendNudge() {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: '_nudge_',
      sender: this.user.uid,
      receiver: this.friend.uid,
      seen: false,
      type: 'nudge'
    };
    this.conversationService.createConversation(message).then(() => {
      this.doNudge();
    });
  }

  doNudge() {
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(() => {
      this.shake = false;
    }, 1000);
  }

  getConversation() {
    this.conversationService
      .getConversation(this.conversationId)
      .valueChanges()
      .subscribe(
        data => {
          this.conversation = data;
          this.conversation.forEach(message => {
            if (!message.seen) {
              message.seen = true;
              this.conversationService.editConversation(message);
              if (message.type === 'text') {
                const audio = new Audio('assets/sound/new_message.m4a');
                audio.play();
              } else if (message.type === 'nudge') {
                this.doNudge();
              }
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  getUserNickById(id) {
    if (id === this.friend.uid) {
      return this.friend.nick;
    } else {
      return this.user.nick;
    }
  }
}
