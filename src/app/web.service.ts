import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material';
import { AuthService } from './auth.service';

@Injectable()
export class WebService {
    BASE_URL = 'http://localhost:63145/api';

    private messageStore = [];
    private messageSubject = new Subject();
    messages = this.messageSubject.asObservable();

    constructor(private http: Http, private auth: AuthService, private sb: MdSnackBar) {
        //this.getMessages();
    }

    // Using promise to process HTTP
    // async getMessages(user) {
    //     try {
    //         user = (user) ? '/' + user : '';        
    //         var response = await this.http.get(this.BASE_URL + '/messages' + user).toPromise();
    //         this.messages = response.json();
    //     } catch (error) {
    //         this.handleError("Unable to get messages");
    //     }
    // }

    // async postMessage(message) {
    //     try {
    //         var response = await this.http.post(this.BASE_URL + '/messages', message).toPromise();
    //         this.messages.push(response.json());
    //     } catch (error) {
    //         this.handleError("Unable to post message");
    //     }
    // }

    // Using Observable to process HTTP
    getMessages(user) {
        user = (user) ? '/' + user : '';        
        var response = this.http.get(this.BASE_URL + '/messages' + user).subscribe(response => {
            this.messageStore = response.json();
            this.messageSubject.next(this.messageStore);
        },
        error => { 
            this.handleError("Unable to get messages");
        });
    }

    postMessage(message) {        
        var response = this.http.post(this.BASE_URL + '/messages', message).subscribe(response => {
            this.messageStore.push(response.json());
            this.messageSubject.next(this.messageStore);
        },
        error => {
            this.handleError("Unable to post message");
        });
    }

    getUser() {
        return this.http.get(this.BASE_URL + '/users/me', this.auth.tokenHeader).map(res => res.json());
    }

    saveUser(userData) {
        return this.http.post(this.BASE_URL + '/users/me', userData,this.auth.tokenHeader).map(res => res.json());
    }
    
    private handleError(error) {
        console.error(error);
        this.sb.open(error, 'close', { duration: 2000 });
    }
}