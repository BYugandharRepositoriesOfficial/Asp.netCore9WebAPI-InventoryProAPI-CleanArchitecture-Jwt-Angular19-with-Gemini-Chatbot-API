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
  Supplier,
  SuppliersService
} from '../../services/suppliers.service';

@Component({
  selector: 'app-index-suppliers',
  standalone: true,
  templateUrl: './index-suppliers.component.html',
  styleUrl: './index-suppliers.component.css',

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

export class IndexSuppliersComponent
implements OnInit, AfterViewInit {

  displayedColumns: string[] = [

    'supplierId',
    'supplierName',
    'contactPerson',
    'phoneNumber',
    'email',
    'address',
    'isActive',
    'createdDate',
    'modifiedDate',
    'actions'

  ];

  dataSource =
    new MatTableDataSource<Supplier>();

  showForm = false;

  isEditing = false;

  supplierForm: Supplier =
    this.resetForm();

  @ViewChild(MatPaginator)

  paginator!: MatPaginator;

  @ViewChild(MatSort)

  sort!: MatSort;

  constructor(

    private suppliersService:
      SuppliersService

  ) { }

  ngOnInit(): void {

    this.loadSuppliers();

  }

  ngAfterViewInit(): void {

    this.dataSource.paginator =
      this.paginator;

    this.dataSource.sort =
      this.sort;

  }
  loadSuppliers(): void {

    this.suppliersService.getSuppliers().subscribe({

      next: (data) => {

        this.dataSource.data = data;

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;

      },

      error: (err) => {

        console.error('Error loading suppliers', err);

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

  resetForm(): Supplier {

    return {

      supplierId: 0,

      supplierName: '',

      contactPerson: '',

      phoneNumber: 0,

      email: '',

      address: '',

      isActive: true,

      createdDate: new Date(),

      modifiedDate: new Date()

    };

  }

  openModal(supplier?: Supplier): void {

    this.showForm = true;

    if (supplier) {

      this.supplierForm = { ...supplier };

      this.isEditing = true;

    } else {

      this.supplierForm = this.resetForm();

      this.isEditing = false;

    }

  }
  saveSupplier(): void {

    if (this.isEditing) {

      this.suppliersService.update(
        this.supplierForm.supplierId,
        this.supplierForm
      ).subscribe({

        next: () => {

          this.loadSuppliers();

          this.closeModal();

        },

        error: (err) => {

          console.error('Error updating supplier', err);

        }

      });

    }
    else {

      this.suppliersService.create(
        this.supplierForm
      ).subscribe({

        next: () => {

          this.loadSuppliers();

          this.closeModal();

        },

        error: (err) => {

          console.error('Error creating supplier', err);

        }

      });

    }

  }

  deleteSupplier(id: number): void {

    if (confirm('Are you sure you want to delete this supplier?')) {

      this.suppliersService.delete(id).subscribe({

        next: () => {

          this.loadSuppliers();

        },

        error: (err) => {

          console.error('Error deleting supplier', err);

        }

      });

    }

  }

  closeModal(): void {

    this.showForm = false;

    this.isEditing = false;

    this.supplierForm = this.resetForm();

  }

}