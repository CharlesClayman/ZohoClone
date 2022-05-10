using API.Interfaces;
using System.Security.Claims;

namespace API.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            var nameClaim = httpContextAccessor.HttpContext?.User.Claims.
                FirstOrDefault(c=>c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (Guid.TryParse(nameClaim, out var userId))
            {
                UserId = userId;
            }
        }

        public Guid UserId { get; }
    }
}
