import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  constructor(private angularFireDataBase: AngularFireDatabase) {}

  createRequest(request) {
    const cleanEmail = request.receiverEmail.replace(/\./g, ',');
    return this.angularFireDataBase
      .object('requests/' + cleanEmail + '/' + request.sender)
      .set(request);
  }

  setRequestStatus(request, status) {
    const cleanEmail = request.receiverEmail.replace(/\./g, ',');
    return this.angularFireDataBase
      .object('requests/' + cleanEmail + '/' + request.sender + '/status')
      .set(status);
  }

  getRequestsForEmail(email) {
    const cleanEmail = email.replace(/\./g, ',');
    return this.angularFireDataBase.list('requests/' + cleanEmail);
  }
}
