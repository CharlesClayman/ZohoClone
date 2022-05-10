using API.Interfaces;

using NETCore.MailKit.Core;

namespace API.Services
{
    public class MailkitMailService : IMailService
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<MailkitMailService> _logger;

        public MailkitMailService(IEmailService emailService, ILogger<MailkitMailService> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<bool> SendHtmlMailAsync(string recipientAddress, string subject, string htmlMessage)
        {
            try
            {
                await _emailService.SendAsync(recipientAddress, subject, htmlMessage, true);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occured while sending email.");
                return false;
            }
        }
    }
}