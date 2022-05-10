using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        private readonly ICurrentUserService _currentUserService;
  

        public AccountController(
                                 UserManager<AppUser> userManager,
                                 SignInManager<AppUser> signInManager,
                                 IMapper mapper,
                                 ITokenService tokenService, 
                                 ICurrentUserService currentUserService
                                 )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _tokenService = tokenService;
            _currentUserService = currentUserService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<AppUserReturnDto>> Register(AppUserCreationDto appUser)
        {
            var userExists = await _userManager.Users.AnyAsync(x => x.Email == appUser.Email.ToLower());
            if (userExists)
                return BadRequest("Email already taken.");


            var user = _mapper.Map<AppUser>(appUser);
            user.Email = appUser.Email;

            var result = await _userManager.CreateAsync(user, appUser.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);
            
            return Ok(new AppUserReturnDto
            {
                Email = appUser.Email,
                Token = _tokenService.CreateToken(user),
            });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<AppUserReturnDto>> Login(LoginDto loginDto)
        {
            var user = _userManager.Users.FirstOrDefault(x => x.Email == loginDto.Email.ToLower());
            if (user == null)
                return Unauthorized("Invalid email");

            var result = await _userManager.CheckPasswordAsync(user,loginDto.Password);

            if (!result) return Unauthorized("Invalid password");

            return new AppUserReturnDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
            };
        }

     
        [HttpGet("currentUserInfo")]
        public async Task<ActionResult<AppUser>> GetCurrentUserInfo()
        {
           
            var userId = _currentUserService.UserId;
            if (userId != Guid.Empty)
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                var userToReturn = _mapper.Map<CurrentUserReturnDto>(user);
                return Ok(userToReturn);
            }
            return Unauthorized("User not logged in");
        }

    }
}
