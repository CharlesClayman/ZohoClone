using API.Entities;

namespace API.DTOs
{
    public class InvoiceReturnDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string InvoiceNumber { get; set; }
        public string OrderNumber { get; set; }
        public Guid TermId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public virtual SalesPerson SalePerson { get; set; }
        public string Subject { get; set; }
        public Guid ItemId { get; set; }
        public int Discount { get; set; }
        public int ShippingCharges { get; set; }
        public int Adjustments { get; set; }
        public string CustomerNotes { get; set; }
        public string TermsAndConditions { get; set; }
        public string AttachFile { get; set; }
    }
}
