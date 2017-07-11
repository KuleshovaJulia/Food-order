import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

form: FormGroup;
message;
messageClass;
processing = false;



  constructor(
  	private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  		this.createForm()
    }


createForm(){
	this.form = this.formBuilder.group({
	name: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(15), 
        this.validateName
      ])],
	surname: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(20), 
        this.validateSurname
      ])],
	email: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(30), 
        this.validateEmail
      ])],
	password: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(30), 
        this.validatePassword       
      ])],
	confirm: ['', Validators.required],
	number: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(14), 
        Validators.maxLength(15), 
        this.validateNumber
      ])],
	},  { validator: this.matchingPasswords('password', 'confirm') }); 
}

disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['name'].disable();
    this.form.controls['surname'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
    this.form.controls['number'].disable();
  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['name'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
    this.form.controls['number'].enable();
    this.form.controls['surname'].enable();
  }


validateEmail(controls) {
    const regExp =  new RegExp(/^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/);
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validateEmail': true }
    }
  }

validateName(controls) {
    const regExp = new RegExp (/^[a-zа-яА-ЯA-Z]+$/);
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validateName': true }
    }
  }

  validateSurname(controls) {
    const regExp = new RegExp (/^[a-zA-Zа-яА-Я]+$/);
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validateSurname': true } 
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=(.*[a-zA-Z]){4}).{8,20}/);
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validatePassword': true } 
    }
  }

  validateNumber(controls) {
    const regExp = new RegExp (/^\(0\d{2}\) \d{3}-\d{2}-\d{2}$/);
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validateNumber': true } 
    }
  }

matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }


onRegisterSubmit() {
	this.processing = true;
	this.disableForm();
	const user = {
		name: this.form.get('name').value,
		surname: this.form.get('surname').value,
		email: this.form.get('email').value,
		password: this.form.get('password').value,
		number: this.form.get('number').value


	}
	this.authService.registerUser(user).subscribe(data=>{
		if(!data.success){
		this.messageClass = 'alert alert-danger';
		this.message = data.message;
		this.processing = false;
		this.enableForm();
		} else {
		this.messageClass = 'alert alert-success';
		this.message = data.message;
		setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000)
		}
	});

}




  ngOnInit() {
  }

}
