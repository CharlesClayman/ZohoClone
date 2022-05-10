using API.Entities;

namespace API.Helpers
{
    public class MailMessage
    {
        public string Title { get; set; }

        public string Header { get; set; }

        public string Message { get; set; }

        public bool IncludeLinkButton { get; set; }

        public string Link { get; set; }

        public string LinkText { get; set; }

        public AppUser User { get; set; }
    }
}