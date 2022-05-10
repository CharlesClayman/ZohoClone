using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext:IdentityDbContext<AppUser,
        AppRole,
        Guid,IdentityUserClaim<Guid>,AppUserRole,
        IdentityUserLogin<Guid>,IdentityRoleClaim<Guid>,
        IdentityUserToken<Guid>>
    {
        public DataContext(DbContextOptions options):base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(u => u.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
               .HasMany(ur => ur.UserRoles)
               .WithOne(u => u.Role)
               .HasForeignKey(u => u.RoleId)
               .IsRequired();

            builder.Entity<Item>()
                .Property(p => p.SellingPrice)
                .HasPrecision(18,2);

            builder.Entity<Invoice>()
                .Property(p=>p.SubTotal)
                 .HasPrecision(18, 2);
            builder.Entity<Invoice>()
                .Property(p => p.Adjustments)
                .HasPrecision(18, 2);
            builder.Entity<Invoice>()
                .Property(p=>p.Total)
                .HasPrecision(18,2);
            builder.Entity<Income>()
                .Property(p => p.BankCharges)
                .HasPrecision(18, 2);
            builder.Entity<Expenses>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);
            builder.Entity<Income>()
                .Property(p => p.AmountReceived)
                .HasPrecision(18, 2);
            builder.Entity<Tax>()
                .Property(p => p.TaxRate)
                .HasPrecision(18, 2);
        }
        public DbSet<Income> Income { get; set; }
        public DbSet<Expenses> Expenses { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<CustomerAddress> CustomerAddresses { get; set; }
        public DbSet<CustomerContactPerson> CustomerContactPerson { get; set; }
        public DbSet<CustomerOtherDetails> CustomerOtherDetails { get; set; }
        public DbSet<Item> Item { get; set; }
        public DbSet<Category> Category{ get; set; }
        public DbSet<SalesPerson> SalesPerson { get; set; }
        public DbSet<Terms> Terms { get; set; }
        public DbSet<Tax> Tax { get;set; }
        public DbSet<Invoice> Invoice { get; set; }
    }
}
