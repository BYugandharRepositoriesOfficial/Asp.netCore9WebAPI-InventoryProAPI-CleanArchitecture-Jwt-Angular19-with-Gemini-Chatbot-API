import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NgModel } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Category, CategoriesService } from '../../services/categories.service';
import { Product, ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-angular-inventory',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterModule,
    FormsModule,

    // Angular Material
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule

  ],
  templateUrl: './angular-inventory.component.html',
  styleUrl: './angular-inventory.component.css'
})
export class AngularInventoryComponent implements OnInit {

  currentDateTime: Date = new Date();

  products: Product[] = [];
  categories: Category[] = [];
  userName: string = '';
   searchText: string = '';

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.userName = localStorage.getItem('userName') || 'Admin';

    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);

    this.productsService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error(err)
    });

    this.categoriesService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}




    
    
  


