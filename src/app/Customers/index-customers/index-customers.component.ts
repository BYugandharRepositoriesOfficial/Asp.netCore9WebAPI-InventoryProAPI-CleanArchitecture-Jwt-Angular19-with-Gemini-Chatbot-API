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
  Customer,
  CustomersService
} from '../../services/customers.service';

@Component({
  selector: 'app-index-customers',
  standalone: true,
  templateUrl: './index-customers.component.html',
  styleUrl: './index-customers.component.css',

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

export class IndexCustomersComponent
implements OnInit, AfterViewInit {

  displayedColumns: string[] = [

    'customerId',
    'customerName',
    'phoneNumber',
    'email',
    'address',
    'isActive',
    'createdDate',
    'updatedDate',
    'actions'

  ];

  dataSource =
    new MatTableDataSource<Customer>();

  showForm = false;

  isEditing = false;

  customerForm: Customer =
    this.resetForm();

  @ViewChild(MatPaginator)

  paginator!: MatPaginator;

  @ViewChild(MatSort)

  sort!: MatSort;

  constructor(

    private customersService:
      CustomersService

  ) { }

  ngOnInit(): void {

    this.loadCustomers();

  }

  ngAfterViewInit(): void {

    this.dataSource.paginator =
      this.paginator;

    this.dataSource.sort =
      this.sort;

  }

  loadCustomers(): void {

    this.customersService.getCustomers().subscribe({

      next: (data) => {

        this.dataSource.data = data;

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;

      },

      error: (err) => {

        console.error('Error loading customers', err);

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

  resetForm(): Customer {

    return {

      customerId: 0,

      customerName: '',

      phoneNumber: '',

      email: '',

      address: '',

      isActive: true,

      createdDate: new Date(),

      updatedDate: new Date()

    };

  }

  openModal(customer?: Customer): void {

    this.showForm = true;

    if (customer) {

      this.customerForm = { ...customer };

      this.isEditing = true;

    }
    else {

      this.customerForm = this.resetForm();

      this.isEditing = false;

    }

  }

  saveCustomer(): void {

    if (this.isEditing) {

      this.customersService.update(
        this.customerForm.customerId,
        this.customerForm
      ).subscribe({

        next: () => {

          this.loadCustomers();

          this.closeModal();

        },

        error: (err) => {

          console.error('Error updating customer', err);

        }

      });

    }
    else {

      this.customersService.create(
        this.customerForm
      ).subscribe({

        next: () => {

          this.loadCustomers();

          this.closeModal();

        },

        error: (err) => {

          console.error('Error creating customer', err);

        }

      });

    }

  }

  deleteCustomer(id: number): void {

    if (confirm('Are you sure you want to delete this customer?')) {

      this.customersService.delete(id).subscribe({

        next: () => {

          this.loadCustomers();

        },

        error: (err) => {

          console.error('Error deleting customer', err);

        }

      });

    }

  }

  closeModal(): void {

    this.showForm = false;

    this.isEditing = false;

    this.customerForm = this.resetForm();

  }

}