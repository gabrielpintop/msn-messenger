import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UserService } from './services/user/user.service';
import { RequestsService } from './services/requests/requests.service';
import { User } from './interfaces/user';
import { DialogService } from 'ng2-bootstrap-modal';
import { RequestComponent } from './modals/request/request.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'msn-messenger';
  user: User;
  requests: any[] = [];
  mailsShown: any[] = [];

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private requestsService: RequestsService,
    private dialogService: DialogService
  ) {
    this.authenticationService.getStatus().subscribe(status => {
      this.userService
        .getUserById(status.uid)
        .valueChanges()
        .subscribe((data: User) => {
          this.user = data;
          this.requestsService
            .getRequestsForEmail(this.user.email)
            .valueChanges()
            .subscribe(
              (requests: any) => {
                this.requests = requests;
                this.requests = this.requests.filter(r => {
                  return r.status !== 'accepted' && r.status !== 'rejected';
                });
                this.requests.forEach(req => {
                  if (this.mailsShown.indexOf(req.sender) === -1) {
                    this.mailsShown.push(req.sender);
                    this.dialogService.addDialog(RequestComponent, {
                      scope: this,
                      currentRequest: req
                    });
                  }
                });
              },
              err => {
                console.log(err);
              }
            );
        });
    });
  }
}
