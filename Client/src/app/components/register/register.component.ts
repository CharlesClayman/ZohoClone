import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  submitted: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  registrationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    companyName: new FormControl(null),
  });

  registrationFormValid(): boolean {
    if (this.registrationForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  register() {
    this.submitted = true;
    if (this.registrationForm.valid) {
      this.accountService.register(this.registrationForm.value).subscribe(
        (response) => {
          this.router.navigateByUrl('/home');
          console.log(response);
        },
        (error) => {
          console.error(error);
          this.toastr.error(error.error);
        }
      );
    }
  }
}
