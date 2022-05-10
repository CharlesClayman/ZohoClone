import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/_model/category';
import { CategoryService } from 'src/app/_services/category.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css'],
})
export class CategoryEditComponent implements OnInit, OnDestroy {
  selectedItemId: any;
  getCategorySubscription: Subscription | undefined;
  categoryUpdateSubscription: Subscription | undefined;
  categoryForm!: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private modalService: ModalService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control(''),
    });
  }

  ngOnInit(): void {
    this.getCategory(this.selectedItemId);
  }

  getCategory(id: Guid) {
    this.getCategorySubscription = this.categoryService
      .getCategory(id)
      .subscribe(
        (response: any) => {
          this.categoryForm.patchValue({
            name: (response as Category).name,
            description: (response as Category).description,
          });
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  categoryFormValid(): boolean {
    if (this.categoryForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  updateCategory() {
    if (this.categoryForm.valid) {
      this.categoryUpdateSubscription = this.categoryService
        .updateCategory(this.categoryForm.value, this.selectedItemId)
        .subscribe(
          (response: any) => {
            this.sharedService.getGetCategories();
            this.toastr.success('Category updated');
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

  ngOnDestroy(): void {
    this.getCategorySubscription?.unsubscribe();
    this.categoryUpdateSubscription?.unsubscribe();
  }
}
