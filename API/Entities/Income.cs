using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Income
    {
        public Guid Id { get; set; }
        [Required]
        public Guid CustomerId { get; set; }   
        public virtual Customer CustomerName { get; set; }
        [Required]
        public int AmountRecieved { get; set; }
        public decimal BankCharges { get; set; }
        [Required]
        public DateTime PaymentDate { get; set; }
        [Required]
        public int PaymentNumber { get; set; }
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
