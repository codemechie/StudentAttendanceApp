using Microsoft.EntityFrameworkCore;
using SchoolAttendance.Api.Data;
using SchoolAttendance.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Ensure our React Vite frontend (localhost:5173 or others) can query this API openly
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // Typical Vite port
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Add services to the container.
builder.Services.AddOpenApi();

// Register the DbContext using the SQLite connection string
builder.Services.AddDbContext<SchoolDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 1) Apply CORS before hitting the routes
app.UseCors("AllowFrontend");

// 2) Map our separate logic clusters using Minimal APIs
app.MapStudentEndpoints();
app.MapAttendanceEndpoints();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
