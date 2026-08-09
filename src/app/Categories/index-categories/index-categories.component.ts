import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CategoriesService, Category } from '../../services/categories.service';

@Component({
  selector: 'app-index-categories',
  standalone: true,
  templateUrl: './index-categories.component.html',
  styleUrl: './index-categories.component.css',
  imports: [
    CommonModule,
    NgIf,
    FormsModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ]
})
export class CategoriesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'categoryId',
    'categoryName',
    'description',
    'isActive',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  dataSource = new MatTableDataSource<Category>();

  showForm = false;
  isEditing = false;

  categoryForm: Category = this.resetForm();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {

    this.categoriesService.getCategories().subscribe({

      next: (data) => {

        this.dataSource.data = data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  applyFilter(event: Event): void {

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue
      .trim()
      .toLowerCase();

  }

  resetForm(): Category {

    return {

      categoryId: 0,
      categoryName: '',
      description: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()

    };

  }

  openModal(category?: Category): void {

    this.showForm = true;

    if (category) {

      this.categoryForm = { ...category };

      this.isEditing = true;

    }
    else {

      this.categoryForm = this.resetForm();

      this.isEditing = false;

    }

  }

  saveCategory(): void {

    if (this.isEditing) {

      this.categoriesService.update(
        this.categoryForm.categoryId,
        this.categoryForm
      ).subscribe({

        next: () => {

          this.loadCategories();

          this.closeModal();

        }

      });

    }
    else {

      this.categoriesService.create(
        this.categoryForm
      ).subscribe({

        next: () => {

          this.loadCategories();

          this.closeModal();

        }

      });

    }

  }

  deleteCategory(id: number): void {

    if (confirm('Are you sure you want to delete this category?')) {

      this.categoriesService.delete(id).subscribe({

        next: () => {

          this.loadCategories();

        }

      });

    }

  }

  closeModal(): void {

    this.showForm = false;

    this.isEditing = false;

    this.categoryForm = this.resetForm();

  }

}


