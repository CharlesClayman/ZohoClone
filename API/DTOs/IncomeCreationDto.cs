using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class IncomeCreationDto
    {   
        [Required]
        public Guid? CustomerId { get; set; }
        [Required]
        public string Currency { get; set; }
        [Required]
        public decimal AmountReceived { get; set; }
        public decimal BankCharges { get; set; } 
        [Required]
        public DateTime PaymentDate { get; set; }
        [Required]
        public string PaymentNumber { get; set; }
        public string PaymentMode { get; set; }
        public string ReferenceNumber { get; set; }
        public TaxDeducted TaxDeducted { get; set; }
    }
}
