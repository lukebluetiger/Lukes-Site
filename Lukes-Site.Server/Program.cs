using Serilog;
using lukes_site.Server.Hubs;
using lukes_site.Server.Repos;
using lukes_site.Server.Data;
using lukes_site.Server.Services;
using lukes_site.Server.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add logging configuration
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Configure Serilog
builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Add DbContext
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories and services
builder.Services.AddScoped<IBlogPostRepository, SqlBlogPostRepository>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IProjectService, ProjectService>();

// Configure CORS for production
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins(
                // Development URLs
                "https://localhost:5173", 
                "https://localhost:7116",
                "http://localhost:5173", 
                "http://localhost:7116",
                // temp azure URL  
                "https://lukes-site.azurewebsites.net"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Add custom error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();
app.MapHub<UserCountHub>("/hubs/userCountHub");
app.MapFallbackToFile("index.html");

try
{
    Log.Information("Starting web application");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}