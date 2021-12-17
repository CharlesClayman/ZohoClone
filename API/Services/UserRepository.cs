using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<AppUser> GetUser(string email)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        }


        public async Task<bool> SaveAllChanges()
        {
          return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UserExists(string email)
        {
           return await _context.Users.AnyAsync(u=>u.Email == email);
        }
    }
}
