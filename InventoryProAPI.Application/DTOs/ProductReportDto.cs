namespace InventoryProAPI.Application.DTOs.Reports
{
    public class ProductReportDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

        public string SupplierName { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public string Unit { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}
