using InventoryProAPI.Application;

namespace InventoryProAPI.Application.Interfaces
{
    public interface IProductReportService
    {
        Task<byte[]> GenerateProductPdfAsync();
    }
}
