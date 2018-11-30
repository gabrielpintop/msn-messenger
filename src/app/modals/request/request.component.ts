import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/services/user/user.service';
import { RequestsService } from 'src/app/services/requests/requests.service';

export interface PromptModel {
  scope: any;
  currentRequest: any;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any>
  implements PromptModel {
  scope: any;
  currentRequest: any;
  constructor(
    public dialogService: DialogService,
    private userService: UserService,
    private requestsService: RequestsService
  ) {
    super(dialogService);
  }

  select(selection) {
    if (selection === 'yes') {
      this.requestsService
        .setRequestStatus(this.currentRequest, 'accepted')
        .then(data => {
          console.log(data);
          this.userService
            .addFriend(this.scope.user.uid, this.currentRequest.sender)
            .then(() => {
              alert('The request was accepted');
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else if (selection === 'no') {
      this.requestsService
        .setRequestStatus(this.currentRequest, 'rejected')
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
