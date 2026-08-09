using InventoryProAPI.Application.Interfaces;
using InventoryProAPI.Persistence.Data;

using Microsoft.EntityFrameworkCore;

using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;

namespace InventoryProAPI.Persistence.Repositories
{
    public class ProductReportRepository : IProductReportRepository
    {
        private readonly AppDbContext _context;

        public ProductReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<byte[]> GenerateProductPdfAsync()
        {
            var products = await _context.Products

                .Include(p => p.Category)

                .Include(p => p.Supplier)

                .ToListAsync();

            using MemoryStream stream = new MemoryStream();

            PdfWriter writer = new PdfWriter(stream);

            PdfDocument pdf = new PdfDocument(writer);

            Document document = new Document(pdf);

            Paragraph title = new Paragraph("PRODUCT REPORT")
                 .SimulateBold()
                .SetFontSize(18)
                .SetTextAlignment(TextAlignment.CENTER);

            document.Add(title);

            document.Add(new Paragraph(" "));

            Table table = new Table(7).UseAllAvailableWidth();

            table.AddHeaderCell("ID");
            table.AddHeaderCell("Product");
            table.AddHeaderCell("Category");
            table.AddHeaderCell("Supplier");
            table.AddHeaderCell("Price");
            table.AddHeaderCell("Qty");
            table.AddHeaderCell("Unit");

            foreach (var product in products)
            {
                table.AddCell(product.ProductId.ToString());

                table.AddCell(product.ProductName);

                table.AddCell(product.Category?.CategoryName ?? "");

                table.AddCell(product.Supplier?.SupplierName ?? "");

                table.AddCell(product.Price.ToString("0.00"));

                table.AddCell(product.Quantity.ToString());

                table.AddCell(product.Unit);
            }

            document.Add(table);

            document.Close();

            return stream.ToArray();
        }
    }
}