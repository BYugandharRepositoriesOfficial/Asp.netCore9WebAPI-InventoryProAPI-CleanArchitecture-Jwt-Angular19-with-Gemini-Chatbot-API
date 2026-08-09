import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ProductReportService } from '../services/productreports.service';

@Component({
  selector: 'app-product-reports',
  standalone: true,

  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],

  templateUrl: './product-reports.component.html',
  styleUrl: './product-reports.component.css'
})
export class ReportComponent {

  isDownloading = false;

  constructor(
    private reportService: ProductReportService
  ) { }

  downloadPdf(): void {

    this.isDownloading = true;

    this.reportService.downloadProductReport().subscribe({

      next: (response: Blob) => {

        const file = new Blob(
          [response],
          { type: 'application/pdf' }
        );

        const fileURL =
          window.URL.createObjectURL(file);

        const link =
          document.createElement('a');

        link.href = fileURL;

        link.download = 'ProductReport.pdf';

        link.click();

        window.URL.revokeObjectURL(fileURL);

        this.isDownloading = false;

      },

      error: (error) => {

        console.error(
          'Download Failed',
          error
        );

        this.isDownloading = false;

      }

    });

  }

}