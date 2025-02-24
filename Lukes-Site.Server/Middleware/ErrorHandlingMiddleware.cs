// Middleware/ErrorHandlingMiddleware.cs
using System.Net;
using System.Text.Json;

namespace lukes_site.Server.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger, IWebHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                await HandleExceptionAsync(context, ex);
            }
        }
        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var response = new { message = "", statusCode = 500 };

            switch (exception)
            {
                case KeyNotFoundException:
                    context.Response.StatusCode = 404;
                    response = new { message = "Resource not found", statusCode = 404 };
                    break;
                case UnauthorizedAccessException:
                    context.Response.StatusCode = 401;
                    response = new { message = "Unauthorized", statusCode = 401 };
                    break;
                default:
                    context.Response.StatusCode = 500;
                    response = new { 
                        message = _env.IsDevelopment() 
                            ? exception.Message 
                            : "An error occurred", 
                        statusCode = 500 
                    };
                    break;
            }


            // Convert the response object to a JSON string
            var jsonString = JsonSerializer.Serialize(response);
            // Write the JSON string to the response body
            await context.Response.WriteAsync(jsonString);
        }
    }
}