using InventoryProAPI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InventoryProAPI.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductReportController : ControllerBase
    {
        private readonly IProductReportService _service;

        public ProductReportController(IProductReportService service)
        {
            _service = service;
        }

        [HttpGet("pdf")]
        public async Task<IActionResult> DownloadPdf()
        {
            var pdf = await _service.GenerateProductPdfAsync();

            return File(
                pdf,
                "application/pdf",
                "ProductReport.pdf");
        }
    }
}
