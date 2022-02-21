using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class InvoiceCreationDto
    {
        [Required]
        public string InvoiceNumber { get; set; }
        public string OrderNumber { get; set; }
        public Guid TermId { get; set; }
        public Terms Terms { get; set; }
        public DateTime InvoiceDate { get; set; }
        public Guid SalesPersonId { get; set; }
        public SalesPerson SalePerson { get; set; }
        public string Subject { get; set; }
        public Guid ItemId { get; set; }
        public Item Item { get; set; }
        public int Discount { get; set; }
        public int ShippingCharges { get; set; }
        public int Adjustments { get; set; }
        public string CustomerNotes { get; set; }
        public string TermsAndConditions { get; set; }
        public string AttachFile { get; set; }
    }
}
