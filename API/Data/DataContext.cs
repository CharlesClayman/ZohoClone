using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext:IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options):base(options)
        {

        }
        public DbSet<Income> Income { get; set; }
        public DbSet<Expenses> Expenses { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerAddress> CustomerAddresses { get; set; }
        public DbSet<CustomerContactPerson> CustomerContactPerson { get; set; }
        public DbSet<CustomerOtherDetails> CustomerOtherDetails { get; set; }
        public DbSet<Items> Items { get; set; }
        public DbSet<Category> Category{ get; set; }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    builder.Entity<CustomerOtherDetails>()
        //        .HasOne(a => a.CustomerId)
        //        .WithOne(b => b.OtherDetails);
        //}
    }
}
