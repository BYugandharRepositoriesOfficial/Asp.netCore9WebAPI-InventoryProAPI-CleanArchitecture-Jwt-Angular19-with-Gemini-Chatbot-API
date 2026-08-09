import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../services/chat.service.service';
import { NgModel } from '@angular/forms';


import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { Chart, registerables } from 'chart.js';

import { ProductsService } from '../services/products.service';
import { CategoriesService } from '../services/categories.service';
import { SuppliersService } from '../services/suppliers.service';
import { CustomersService } from '../services/customers.service';
import { SalesService } from '../services/sales.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    CommonModule,
    FormsModule,

  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatTabsModule,

  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalProducts = 0;
  totalCategories = 0;
  totalSuppliers = 0;
  totalCustomers = 0;
  totalSales = 0;
  totalRevenue = 0;

  products: any[] = [];
  categories: any[] = [];

  recentSales: any[] = [];
  lowStockProducts: any[] = [];

  

  salesColumns = [
    'saleNumber',
    'customer',
    'total'
  ];

  stockColumns = [
    'product',
    'quantity'
  ];

  pieChart!: Chart;
  lineChart!: Chart;

  constructor(

    private productService: ProductsService,

    private categoryService: CategoriesService,

    private supplierService: SuppliersService,

    private customerService: CustomersService,

    private salesService: SalesService,

    private chatService: ChatService,

  ) {}

  ngOnInit(): void {

    this.loadDashboardData();

    this.loadProducts();

    this.loadCategories();

    this.loadSalesChart();

  }
    loadDashboardData(): void {

    this.supplierService.getSuppliers().subscribe({

      next: (suppliers) => {

        this.totalSuppliers = suppliers.length;

      },

      error: (err) => console.error(err)

    });

    this.customerService.getCustomers().subscribe({

      next: (customers) => {

        this.totalCustomers = customers.length;

      },

      error: (err) => console.error(err)

    });

    this.salesService.getSales().subscribe({

      next: (sales: any[]) => {

        this.totalSales = sales.length;

        this.totalRevenue = sales.reduce(

          (sum, sale) => sum + sale.totalAmount,

          0

        );

        this.recentSales = sales

          .slice(-5)

          .reverse()

          .map(sale => ({

            saleNumber: sale.saleNumber,

            customer: sale.customerName ??
                      ('Customer ' + sale.customerId),

            total: sale.totalAmount

          }));

      },

      error: (err) => console.error(err)

    });

  }

  loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (products: any[]) => {

        this.products = products;

        this.totalProducts = products.length;

        this.lowStockProducts = products

          .filter(p => p.quantity <= 10)

          .map(p => ({

            product: p.productName,

            quantity: p.quantity

          }));

        this.loadPieChart();

      },

      error: (err) => console.error(err)

    });

  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (categories: any[]) => {

        this.categories = categories;

        this.totalCategories = categories.length;

        this.loadPieChart();

      },

      error: (err) => console.error(err)

    });

  }
    loadPieChart(): void {

    if (this.products.length === 0 || this.categories.length === 0) {
      return;
    }

    const labels = this.categories.map(c => c.categoryName);

    const values = this.categories.map(c =>
      this.products.filter(p => p.categoryId === c.categoryId).length
    );

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart('pieChart', {

      type: 'pie',

      data: {

        labels: labels,

        datasets: [

          {

            data: values,

            backgroundColor: [

              '#1976d2',
              '#43a047',
              '#fb8c00',
              '#8e24aa',
              '#00acc1',
              '#ef5350',
              '#7cb342'

            ]

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {

            position: 'right'

          }

        }

      }

    });

  }

  createLineChart(labels: string[], values: number[]): void {

    if (this.lineChart) {

      this.lineChart.destroy();

    }

    this.lineChart = new Chart('salesLineChart', {

      type: 'line',

      data: {

        labels: labels,

        datasets: [

          {

            label: 'Monthly Sales',

            data: values,

            borderColor: '#1976d2',

            backgroundColor: 'rgba(25,118,210,0.15)',

            fill: true,

            tension: 0.4

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {

            display: true

          }

        }

      }

    });

  }

  loadSalesChart(): void {

    this.salesService.getSales().subscribe({

      next: (sales: any[]) => {

        const monthlySales: { [key: string]: number } = {};

        sales.forEach(sale => {

          const month = new Date(sale.saleDate).toLocaleString(

            'default',

            { month: 'short' }

          );

          monthlySales[month] =

            (monthlySales[month] || 0) +

            sale.totalAmount;

        });

        this.createLineChart(

          Object.keys(monthlySales),

          Object.values(monthlySales)

        );

      },

      error: (err) => {

        console.error(err);

      }

    });

  }


}

