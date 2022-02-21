using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class IncomeCreationDto
    {   
        [Required]
        public Guid CustomerId { get; set; }
        [Required]
        public int AmountRecieved { get; set; }
        public int BankCharges { get; set; } 
        [Required]
        public DateTime PaymentDate { get; set; }
        [Required]
        public int PaymentNumber { get; set; }
        public string PaymentMode { get; set; }
        public string ReferenceNumber { get; set; }
        public TaxDeducted TaxDeducted { get; set; }
    }
}
