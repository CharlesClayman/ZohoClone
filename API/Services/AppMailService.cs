using API.Entities;
using API.Helpers;
using API.Interfaces;

using Microsoft.Extensions.Options;

namespace API.Services
{
    public class AppMailService : IAppMailService
    {
        private readonly string _htmlViewTemplate = "Mail/MailTemplate";
        private readonly IMailService _mailService;
        private readonly ITemplateService _templateService;
        private readonly ClientSettingOptions _clientSettingOptions;
        private readonly IUrlService _urlService;

        public AppMailService(IMailService mailService, ITemplateService templateService, IOptions<ClientSettingOptions> options, IUrlService urlService)
        {
            _mailService = mailService;
            _templateService = templateService;
            _clientSettingOptions = options.Value;
            _urlService = urlService;
        }

        public async Task<bool> SendPasswordResetTokenAsync(string token, AppUser user)
        {
            var absoluteUri = _urlService.GenerateAbsoluteUrl(_clientSettingOptions.ResetPasswordUrl);
            var activationLink = _urlService.AppendUriQueryInfo(absoluteUri, new Dictionary<string, string>
               {
                    {"token",token },
                    {"email",user.Email }
               });

            var mailMessage = new MailMessage
            {
                Title = "Reset your password",
                Link = activationLink,
                User = user,
                LinkText = "Reset password",
                IncludeLinkButton = true,
                Message = "You requested to reset your password. Please click on the link to do so."
            };

            var subject = "Reset password";
            var template = await _templateService.GetTemplateHtmlAsStringAsync(_htmlViewTemplate, mailMessage);

            return await _mailService.SendHtmlMailAsync(user.Email, subject, template);
        }
    }
}