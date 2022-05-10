using API.Entities;

namespace API.Interfaces
{
    public interface IAppMailService
    {
        Task<bool> SendPasswordResetTokenAsync(string token, AppUser user);
    }
}