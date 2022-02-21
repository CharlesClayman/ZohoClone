using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CustomerOtherDetailsCreationDto
    {
        public string Currency { get; set; }
        public int TaxRate { get; set; }
        public string PaymentTerms { get; set; }
        public EnablePortal EnablePortal { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
    }
}
