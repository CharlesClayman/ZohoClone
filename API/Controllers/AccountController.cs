using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController:BaseApiController
    {
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;

        public AccountController(DataContext context, 
                                 UserManager<AppUser> userManager,
                                 IConfiguration configuration,
                                 IUserRepository userRepository)
        {
            _context = context;
           _userManager = userManager;
            _configuration = configuration;
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AppUserDto>> Register(RegistrationDto registrationDto)
        {
            var userExists = await _userRepository.UserExists(registrationDto.Email);
            if (userExists)
                return BadRequest("Email already taken.");


            var user = new AppUser
            {
                Email = registrationDto.Email,
                UserName= registrationDto.Email
            };

            var result = await _userManager.CreateAsync(user,registrationDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            
            var tokenService = new TokenService(_configuration);
            var token = tokenService.CreateToken(user);
            return Ok(new AppUserDto
            {
                Email = registrationDto.Email,
                Token = token,
            }) ;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AppUserDto>> Login(LoginDto loginDto)
        {
            var user = await _userRepository.GetUser(loginDto.Email);
            if(user ==null)
                return Unauthorized("Invalid email");

            var hmac = new HMACSHA512();
            var computeLoginPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for(int i =0; i<=computeLoginPasswordHash.Length; i++)
            {
              if(computeLoginPasswordHash[i] != user.PasswordHash[i])
                    return Unauthorized("Invalid password");
            }

            var tokenService = new TokenService(_configuration);
            var token = tokenService.CreateToken(user) ;

            return new AppUserDto
            {
                Email= loginDto.Email,
                Token = token,
            };
        }

    }
}
