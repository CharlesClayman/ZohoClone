import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
})
export class NewCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  path!: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private sharedService: SharedService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control(''),
    });
  }

  ngOnInit(): void {
    this.path = window.location.pathname;
  }

  categoryFormValid(): boolean {
    if (this.categoryForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  createCategory() {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe(
        (response: any) => {
          this.sharedService.getGetCategories();
          this.toastr.success('New category created');
          this.close();
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
    }
  }

  close() {
    this.modalService.closeModal();
  }
}
