using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository 
    {
        Task<bool> SaveAllChanges();
        Task<AppUser> GetUser(string Email);
        Task<bool> UserExists(string email);

    }
}
