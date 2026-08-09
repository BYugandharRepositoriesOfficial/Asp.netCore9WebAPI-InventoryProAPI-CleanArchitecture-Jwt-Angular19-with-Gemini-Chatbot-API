using InventoryProAPI.Application;


namespace InventoryProAPI.Application.Interfaces
{
    public interface IProductReportRepository
    {
        Task<byte[]> GenerateProductPdfAsync();
    }
}
