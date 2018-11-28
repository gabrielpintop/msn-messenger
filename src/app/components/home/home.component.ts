import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  friends: User[];
  query = '';

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
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
}
