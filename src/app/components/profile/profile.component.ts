import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { User } from 'src/app/interfaces/user';
import { ImageCroppedEvent } from 'ngx-image-cropper/src/image-cropper.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;

  constructor(
    private firebaseStorage: AngularFireStorage,
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
    if (this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage
        .ref('pictures/' + currentPictureId + '.jpg')
        .putString(this.croppedImage, 'data_url');

      pictures
        .then(result => {
          this.picture = this.firebaseStorage
            .ref('pictures/' + currentPictureId + '.jpg')
            .getDownloadURL();
          this.picture.subscribe(url => {
            this.userService
              .setAvatar(url, this.user.uid)
              .then(() => {
                alert('Avatar correctly changed');
              })
              .catch(err => {
                alert('There was an error while trying to submit the image');
                console.log(err);
              });
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
}
