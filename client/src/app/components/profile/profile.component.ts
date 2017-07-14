import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

name;
surname;
email;
number;

  constructor(
  	private authService: AuthService
  ) { }

  ngOnInit() {
  	this.authService.getProfile().subscribe(profile => {
    this.name = profile.user.name; 
    this.surname = profile.user.surname; 
    this.email = profile.user.email; 
    this.number = profile.user.number; 

    });
  }

}
