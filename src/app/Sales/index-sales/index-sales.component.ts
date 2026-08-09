import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild
} from '@angular/core';

import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';

import {
  MatPaginatorModule,
  MatPaginator
} from '@angular/material/paginator';

import {
  MatSortModule,
  MatSort
} from '@angular/material/sort';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  Sale,
  SalesService
} from '../../services/sales.service';

@Component({
  selector: 'app-index-sales',
  standalone: true,
  templateUrl: './index-sales.component.html',
  styleUrl: './index-sales.component.css',

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
export class IndexSalesComponent
implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'saleId',
    'saleNumber',
    'customerId',
    'saleDate',
    'totalAmount',
    'isActive',
    'createdDate',
    'updatedDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<Sale>();

  showForm = false;

  isEditing = false;

  saleForm: Sale = this.resetForm();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private salesService: SalesService
  ) { }

  ngOnInit(): void {

    this.loadSales();

  }

  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

  }
  loadSales(): void {

    this.salesService.getSales().subscribe({

      next: (data) => {

        this.dataSource.data = data;

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;

      },

      error: (err) => {

        console.error('Error loading sales', err);

      }

    });

  }

  applyFilter(event: Event): void {

    const filterValue =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {

      this.dataSource.paginator.firstPage();

    }

  }

  resetForm(): Sale {

    return {

      saleId: 0,

      saleNumber: 0,

      customerId: 0,

      saleDate: new Date(),

      totalAmount: 0,

      isActive: true,

      createdDate: new Date(),

      updatedDate: new Date()

    };

  }

  openModal(sale?: Sale): void {

    this.showForm = true;

    if (sale) {

      this.saleForm = { ...sale };

      this.isEditing = true;

    } else {

      this.saleForm = this.resetForm();

      this.isEditing = false;

    }

  }
  saveSale(): void {

    if (this.isEditing) {

      this.salesService.update(
        this.saleForm.saleId,
        this.saleForm
      ).subscribe({

        next: () => {

          this.loadSales();

          this.closeModal();

        },

        error: (err) => {

          console.error('Error updating sale', err);

        }

      });

    } else {

      this.salesService.create(
        this.saleForm
      ).subscribe({

        next: () => {

          this.loadSales();

          this.closeModal();

        },

        error: (err) => {

          console.error('Error creating sale', err);

        }

      });

    }

  }

  deleteSale(id: number): void {

    if (confirm('Are you sure you want to delete this sale?')) {

      this.salesService.delete(id).subscribe({

        next: () => {

          this.loadSales();

        },

        error: (err) => {

          console.error('Error deleting sale', err);

        }

      });

    }

  }

  closeModal(): void {

    this.showForm = false;

    this.isEditing = false;

    this.saleForm = this.resetForm();

  }

}



