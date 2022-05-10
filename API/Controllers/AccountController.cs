using API.DTOs;
using API.Entities;
using API.Helpers;
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
        private readonly IAppMailService _appMailService;

        public AccountController(
                                 UserManager<AppUser> userManager,
                                 SignInManager<AppUser> signInManager,
                                 IMapper mapper,
                                 ITokenService tokenService,
                                 ICurrentUserService currentUserService
, IAppMailService appMailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _tokenService = tokenService;
            _currentUserService = currentUserService;
            _appMailService = appMailService;
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

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

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

        [AllowAnonymous]
        [HttpPost("forgotPassword")]
        public async Task<ActionResult> ForgotPassword(ForgotPasswordDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            var messageToReturn = "Password reset link has been sent to your email address. please verify.";
            if (user == null)
            {
                return Ok(messageToReturn);
            }

            var passwordToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            passwordToken = TokenFormatter.EncodeToken(passwordToken);

            var result = await _appMailService.SendPasswordResetTokenAsync(passwordToken, user);

            if (!result)
            {
                return BadRequest("An error occured while processing request");
            }

            return Ok(messageToReturn);
        }

        [AllowAnonymous]
        [HttpPost("resetPassword")]
        public async Task<ActionResult> ResetPassword(ResetPasswordDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest();
            }

            var decodedToken = TokenFormatter.DecodeToken(request.Token);
            if (decodedToken == null)
            {
                return BadRequest();
            }

            var result = await _userManager.ResetPasswordAsync(user, decodedToken, request.Password);

            if (!result.Succeeded)
            {
                return BadRequest();
            }

            return Ok();
        }

        //User supplies his email address to forgot password end-point
        //Generate a forgot password token with link to user email address
        //user reset his password with another endpoint with the generated token, with new password
    }
}