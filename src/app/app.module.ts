import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MenuComponent } from './components/menu/menu.component';
import { SearchPipe } from './pipes/search';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RequestComponent } from './modals/request/request.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'conversation/:uid',
    component: ConversationComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ConversationComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    ProfileComponent,
    SearchPipe,
    RequestComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireDatabaseModule,
    BrowserModule,
    BootstrapModalModule.forRoot({ container: document.body }),
    FormsModule,
    ImageCropperModule,
    NgbModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [RequestComponent]
})
export class AppModule {}
