import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilesService } from 'src/app/_services/files.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  selectedImage!: File;
  imagePathFromUpload!: any;
  submitted: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private filesService: FilesService
  ) {}

  ngOnInit(): void {}

  registrationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    companyName: new FormControl(null),
    companyLogo: new FormControl(null),
  });

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
    this.uploadImage();
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.selectedImage, this.selectedImage.name);
    this.filesService.upload(formData).subscribe(
      (response: any) => {
        this.imagePathFromUpload = response as string;
        this.toastr.success('Image uploaded');
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  registrationFormValid(): boolean {
    if (this.registrationForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  register() {
    //  this.uploadImage();
    this.registrationForm
      .get('companyLogo')
      ?.setValue(this.imagePathFromUpload.dbPath);
    if (this.registrationForm.valid) {
      this.accountService.register(this.registrationForm.value).subscribe(
        (response) => {
          this.router.navigateByUrl('/home');
        },
        (error) => {
          console.error(error);
          this.toastr.error(error.message);
        }
      );
    }
  }
}
