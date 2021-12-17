using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class CustomerOtherDetails
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        [Required]
        public string Currency { get; set; }
        public int TaxRate { get; set; }
        public string PaymentTerms { get; set; }
        public EnablePortal EnablePortal { get; set; }
        public string PortalLanguage { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
       
    }

    public enum EnablePortal
    {
        Yes,
        No,
    }
}
