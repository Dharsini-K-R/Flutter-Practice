using Curd_Operation.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//builder.Services.AddDbContext<ContactsAPIDbContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("DevConnection")));

builder.Services.AddDbContext<ContactsAPIDbContext>(options =>
{
    var connString = builder.Configuration.GetConnectionString("DevConnection");
    options.UseMySql(connString, ServerVersion.AutoDetect(connString));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

