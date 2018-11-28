import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation = 'logIn';
  email: string = null;
  password: string = null;
  nick: string = null;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {}

  logIn() {
    this.authenticationService
      .loginWithEmail(this.email, this.password)
      .then(data => {
        alert('Welcome to MSN Messenger');
        console.log(data);
        this.router.navigate(['home']);
      })
      .catch(error => {
        alert('There were problems with the login');
        console.log(error);
      });
  }

  register() {
    this.authenticationService
      .registerWithEmail(this.email, this.password)
      .then(data => {
        const user = {
          uid: data.user.uid,
          email: this.email,
          nick: this.nick
        };
        this.userService
          .createUser(user)
          .then(res => {
            alert('The registration was successful');
            console.log(data);
          })
          .catch(err => {
            alert('There were problems with the registration process');
            console.log(err);
          });
      })
      .catch(error => {
        alert('There were problems with the registration process');
        console.log(error);
      });
  }
}
