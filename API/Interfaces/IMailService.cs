namespace API.Interfaces
{
    public interface IMailService
    {
        Task<bool> SendHtmlMailAsync(string recipientAddress, string subject, string htmlMessage);
    }
}