import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/_model/category';
import { CategoryService } from 'src/app/_services/category.service';
import { EventService } from 'src/app/_services/event.service';
import { ModalService } from 'src/app/_services/modal.service';
import { SharedService } from 'src/app/_services/shared.service';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { NewCategoryComponent } from '../new-category/new-category.component';

@Component({
  selector: 'app-category-index',
  templateUrl: './category-index.component.html',
  styleUrls: ['./category-index.component.css'],
})
export class CategoryIndexComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  getAllCategoriesSubs: Subscription | undefined;
  sharedServiceSubs: Subscription | undefined;
  deleteCategorySubs: Subscription | undefined;
  searchEventSubs: Subscription | undefined;
  selectedCategoryId!: Guid;

  constructor(
    private modalService: ModalService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private eventService: EventService
  ) {
    this.sharedServiceSubs = this.sharedService
      .setGetCategories()
      .subscribe(() => this.getCategories());
  }

  ngOnInit(): void {
    this.getCategories();
    this.searchEventSubs = this.eventService.searchEvent.subscribe((value) =>
      value ? this.getCategories(value) : this.getCategories()
    );
  }

  addNewCategory() {
    this.modalService.openModal(NewCategoryComponent);
  }

  editCategory(id: Guid) {
    this.modalService.openModal(CategoryEditComponent, id);
  }

  openDeleteModal(template: TemplateRef<any>, itemId: Guid) {
    this.selectedCategoryId = itemId;
    this.modalService.openModal(template);
  }

  delete() {
    if (this.selectedCategoryId) {
      this.deleteCategorySubs = this.categoryService
        .deleteCategory(this.selectedCategoryId)
        .subscribe(
          (response: any) => {
            this.getCategories();
            this.toastr.success('Category deleted');
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

  getCategories(query: string | null = null) {
    this.categories = [];
    this.getAllCategoriesSubs = this.categoryService
      .getCategories(query)
      .subscribe(
        (response: any) => {
          Object.values(response as Category).map((values) => {
            this.categories.push(values);
          });
        },
        (error: any) => {
          this.toastr.error(error.message);
        }
      );
  }

  deleteCategory() {}

  ngOnDestroy(): void {
    this.getAllCategoriesSubs?.unsubscribe();
    this.sharedServiceSubs?.unsubscribe();
    this.deleteCategorySubs?.unsubscribe();
    this.searchEventSubs?.unsubscribe();
  }
}
