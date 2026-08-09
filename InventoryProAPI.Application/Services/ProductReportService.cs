using InventoryProAPI.Application.Interfaces;

namespace InventoryProAPI.Application.Services
{
    public class ProductReportService : IProductReportService
    {
        private readonly IProductReportRepository _repository;

        public ProductReportService(IProductReportRepository repository)
        {
            _repository = repository;
        }

        public async Task<byte[]> GenerateProductPdfAsync()
        {
            return await _repository.GenerateProductPdfAsync();
        }
    }
}
