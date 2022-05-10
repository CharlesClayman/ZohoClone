using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CustomerOtherDetailsCreationDto
    {
        public string Currency { get; set; }
        public Guid? TaxId { get; set; }
        public Guid? TermsId { get; set; }
        public EnablePortal EnablePortal { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
    }
}
