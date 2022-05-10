using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Invoice:BaseEntity
    {
        [Required]
        public Guid CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        [Required]
        public string InvoiceNumber { get; set; }
        public string OrderNumber { get; set; }
        [Required]
        public DateTime InvoiceDate { get; set; }
        public Guid? TermsId { get; set; }
        public virtual Terms Terms { get; set; }
        public DateTime DueDate { get; set; }
        public Guid? SalesPersonId { get; set; }
        public virtual SalesPerson SalesPerson { get; set; }
        public string Subject { get; set; }
        public string Currency { get; set; }
        public ICollection<InvoiceItem> Items { get; set; } = new HashSet<InvoiceItem>();
        public decimal SubTotal { get; set; }
        public int Discount { get; set; }
        public decimal Adjustments { get; set; }
        public string CustomerNotes { get; set; }
        public string TermsAndConditions { get; set; }
        public string AttachFile { get; set; } 
        public Income Income { get; set; }
        public decimal Total { get; set; }
        public Boolean Paid { get; set; }

    }
}
