using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

public class GeminiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GeminiService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GetResponseAsync(string message)
    {
        var apiKey = _configuration["Gemini:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            throw new Exception("Gemini API key is missing.");
        }

        _httpClient.DefaultRequestHeaders.Remove("x-goog-api-key");
        _httpClient.DefaultRequestHeaders.Add("x-goog-api-key", apiKey);

        var url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

        var request = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new
                        {
                            text = message
                        }
                    }
                }
            }
        };

        var response = await _httpClient.PostAsJsonAsync(url, request);

        // Useful while debugging
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(
                $"Gemini API Error: {(int)response.StatusCode} - {responseBody}");
        }

        using var json = JsonDocument.Parse(responseBody);

        return json
            .RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? "";
    }
}