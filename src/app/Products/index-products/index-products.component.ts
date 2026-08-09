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
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProductsService, Product } from '../../services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './index-products.component.html',
  styleUrls: ['./index-products.component.css'],
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
    MatCheckboxModule,
    MatTooltipModule
  ]
})
export class ProductsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'productId',
    'productName',
    'categoryId',
    'supplierId',
    'quantity',
    'price',
    'unit',
    'isActive',
    'createdDate',
    'modifiedDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<Product>();

  showForm = false;
  isEditing = false;

  productForm: Product = this.resetForm();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts(): void {

    this.productsService.getProducts().subscribe({

      next: (data) => {

        this.dataSource.data = data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  applyFilter(event: Event): void {

    const filterValue =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      filterValue.trim().toLowerCase();

  }

  resetForm(): Product {

    return {

      productId: 0,
      productName: '',
      categoryId: 0,
      supplierId: 0,
      quantity: 0,
      price: 0,
      unit: '',
      description: '',
      isActive: true,
      createdDate: new Date(),
      modifiedDate: new Date()

    };

  }
    openModal(product?: Product): void {

    this.showForm = true;

    if (product) {

      this.productForm = { ...product };
      this.isEditing = true;

    } else {

      this.productForm = this.resetForm();
      this.isEditing = false;

    }

  }

  saveProduct(): void {

    if (this.isEditing) {

      this.productsService.update(
        this.productForm.productId,
        this.productForm
      ).subscribe({

        next: () => {

          this.loadProducts();
          this.closeModal();

        },

        error: (err) => {

          console.error(err);

        }

      });

    } else {

      this.productsService.create(
        this.productForm
      ).subscribe({

        next: () => {

          this.loadProducts();
          this.closeModal();

        },

        error: (err) => {

          console.error(err);

        }

      });

    }

  }

  deleteProduct(id: number): void {

    if (confirm('Are you sure you want to delete this product?')) {

      this.productsService.delete(id).subscribe({

        next: () => {

          this.loadProducts();

        },

        error: (err) => {

          console.error(err);

        }

      });

    }

  }

  closeModal(): void {

    this.showForm = false;
    this.isEditing = false;
    this.productForm = this.resetForm();

  }

}
