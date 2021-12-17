using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Income
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        [Required]
        public Customer CustomerName { get; set; }
        [Required]
        public int AmountRecieved { get; set; }
        public int BankCharges { get; set; }
        [Required]
        public DateTime PaymentDate { get; set; }
        [Required]
        public int PaymentNumber { get; set; }
        public string PaymentMode { get; set; }
        public string ReferenceNumber { get; set; }
        public TaxDeducted TaxDeducte { get; set; }
        
    }

    public enum TaxDeducted
    {
        Yes,
        No,
    }
}
