using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Invoice
    {
        public Guid Id { get; set; }
        [Required]
        public Guid CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        [Required]
        public string InvoiceNumber { get; set; }
        public string OrderNumber { get; set; }
        public Guid TermsId { get; set; }
        public virtual Terms Terms { get; set; }
        public DateTime InvoiceDate { get; set; }
        public Guid? SalesPersonId { get; set; }
        public virtual SalesPerson SalesPerson { get; set; }
        public string Subject { get; set; }
        public Guid ItemId { get; set; }
        public virtual Item Item { get; set; }
        public int Discount { get; set; }
        public decimal ShippingCharges { get; set; }
        public int Adjustments { get; set; }
        public string CustomerNotes { get; set; }
        public string TermsAndConditions { get; set; }
        public string AttachFile { get; set; }
        public Income Income { get; set; }
        public Guid? TaxId { get; set; }
        public virtual Tax Tax { get; set; }

    }
}
