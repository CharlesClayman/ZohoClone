using API.Data;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Services;

using Microsoft.EntityFrameworkCore;

using NETCore.MailKit.Extensions;
using NETCore.MailKit.Infrastructure.Internal;

namespace API.Extensions
{
    public static class InfrastructureServiceExtension
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Add services to the container.
            services.AddScoped<IRepository<AppUser, string>, Repository<AppUser, string>>();
            services.AddScoped<IRepository<Terms, Guid>, Repository<Terms, Guid>>();
            services.AddScoped<IRepository<SalesPerson, Guid>, Repository<SalesPerson, Guid>>();
            services.AddScoped<IRepository<Item, Guid>, Repository<Item, Guid>>();
            services.AddScoped<IRepository<Invoice, Guid>, Repository<Invoice, Guid>>();
            services.AddScoped<IRepository<Income, Guid>, Repository<Income, Guid>>();
            services.AddScoped<IRepository<Expenses, Guid>, Repository<Expenses, Guid>>();
            services.AddScoped<IRepository<Customer, Guid>, Repository<Customer, Guid>>();
            services.AddScoped<IRepository<CustomerAddress, Guid>, Repository<CustomerAddress, Guid>>();
            services.AddScoped<IRepository<CustomerOtherDetails, Guid>, Repository<CustomerOtherDetails, Guid>>();
            services.AddScoped<IRepository<CustomerContactPerson, Guid>, Repository<CustomerContactPerson, Guid>>();
            services.AddScoped<IRepository<Category, Guid>, Repository<Category, Guid>>();
            services.AddScoped<IRepository<Tax, Guid>, Repository<Tax, Guid>>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddTransient<ITemplateService, TemplateService>();
            services.AddTransient<IMailService, MailkitMailService>();
            services.AddTransient<IUrlService, UrlService>();
            services.AddTransient<IAppMailService, AppMailService>();

            services.AddMailKit(option =>
            {
                option.UseMailKit(configuration.GetSection(nameof(MailKitOptions)).Get<MailKitOptions>());
            });

            services.Configure<ClientSettingOptions>(configuration.GetSection(nameof(ClientSettingOptions)));
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.AddDbContext<DataContext>(options =>
            {
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                options.UseSqlServer(connectionString);
            });

            return services;
        }
    }
}