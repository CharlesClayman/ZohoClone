using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Tax:BaseEntity
    {
        [Required]
        public string TaxName { get; set; }
        [Required]
        public decimal TaxRate { get; set; }
        public bool CompoundTax { get; set; }        
        public virtual ICollection<Invoice> Invoices { get; set; }
        public virtual ICollection<CustomerOtherDetails> CustomerOtherDetails { get; set; }
        public virtual ICollection<Expenses> Expenses { get; set; }
        public virtual ICollection<InvoiceItem> InvoiceItems { get; set; }

    }

}
