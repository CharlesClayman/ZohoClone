using API.Data;
using API.Entities;
using API.Interfaces;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IRepository<AppUser, string>, Repository<AppUser, string>>();
builder.Services.AddScoped<IRepository<Terms,Guid>, Repository<Terms,Guid>>();
builder.Services.AddScoped<IRepository<SalesPerson,Guid>, Repository<SalesPerson,Guid>>();
builder.Services.AddScoped<IRepository<Item,Guid>, Repository<Item,Guid>>();
builder.Services.AddScoped<IRepository<Invoice,Guid>, Repository<Invoice,Guid>>();
builder.Services.AddScoped<IRepository<Income,Guid>, Repository<Income,Guid>>();
builder.Services.AddScoped<IRepository<Expenses,Guid>, Repository<Expenses,Guid>>();
builder.Services.AddScoped<IRepository<Customer,Guid>, Repository<Customer,Guid>>();
builder.Services.AddScoped<IRepository<CustomerAddress, Guid>, Repository<CustomerAddress, Guid>>();
builder.Services.AddScoped<IRepository<CustomerOtherDetails, Guid>, Repository<CustomerOtherDetails, Guid>>();
builder.Services.AddScoped<IRepository<CustomerContactPerson, Guid>, Repository<CustomerContactPerson, Guid>>();
builder.Services.AddScoped<IRepository<Category,Guid>, Repository<Category,Guid>>();
builder.Services.AddScoped<IRepository<Tax, Guid>, Repository<Tax,Guid>>();

builder.Services.AddScoped<ITokenService,TokenService>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<DataContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);


});
builder.Services.AddControllers();
builder.Services.AddCors();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentityCore<AppUser>(
    opt => opt.Password.RequireNonAlphanumeric = false
    )
    .AddRoles<AppRole>()
    .AddRoleManager<RoleManager<AppRole>>()
    .AddSignInManager<SignInManager<AppUser>>()
    .AddRoleValidator<RoleValidator<AppRole>>()
    .AddEntityFrameworkStores<DataContext>();

builder.Services.Configure<IdentityOptions>(options =>
{   
    options.User.RequireUniqueEmail = true;
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1; 
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer( options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"])),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    }
        
    );
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();
app.UseCors(policy =>policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200"));
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
