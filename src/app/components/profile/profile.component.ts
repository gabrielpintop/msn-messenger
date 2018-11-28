import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
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
  }

  ngOnInit() {}

  saveSettings() {
    this.userService
      .editUser(this.user)
      .then(() => {
        alert('Saved changes.');
      })
      .catch(err => {
        alert('There was an error during the saving process.');
        console.log(err);
      });
  }
}
