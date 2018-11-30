import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from 'src/app/services/requests/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friends: User[];
  query = '';
  user: User;
  friendEmail: string;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private requestsService: RequestsService
  ) {
    this.authenticationService.getStatus().subscribe(
      status => {
        this.userService
          .getUserById(status.uid)
          .valueChanges()
          .subscribe(
            (data: User) => {
              this.user = data;
            },
            error => {
              console.log(error);
            }
          );
      },
      err => {
        console.log(err);
      }
    );

    this.userService
      .getUsers()
      .valueChanges()
      .subscribe(
        (data: User[]) => {
          this.friends = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {}

  logOut() {
    this.authenticationService
      .logOut()
      .then(() => {
        alert('See you later!');
        this.router.navigate(['login']);
      })
      .catch(err => {
        console.log(err);
      });
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(result => {}, reason => {});
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiverEmail: this.friendEmail,
      sender: this.user.uid,
      status: 'pending'
    };
    this.requestsService
      .createRequest(request)
      .then(() => {
        alert('The request has been sended');
      })
      .catch(err => {
        alert('There was an error');
      });
  }
}
