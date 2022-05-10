using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Income:BaseEntity
    {
        [Required]
        public Guid CustomerId { get; set; }   
        public virtual Customer Customer { get; set; }
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
        public Guid? InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
        public string Notes { get; set; }
        public string UploadFile { get; set; }

    }

    public enum TaxDeducted
    {
        Yes,
        No,
    }
}
