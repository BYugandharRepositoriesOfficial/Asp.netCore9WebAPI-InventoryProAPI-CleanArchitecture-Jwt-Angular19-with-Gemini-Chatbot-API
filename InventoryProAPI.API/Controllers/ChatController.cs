using InventoryProAPI.Application.Services;
using InventoryProAPI.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InventoryProAPI.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly GeminiService _service;

        public ChatController(GeminiService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Chat(ChatRequest request)
        {
            var result = await _service.GetResponseAsync(request.Message);

            return Ok(new ChatResponse
            {
                Reply = result
            });
        }
    }
}
