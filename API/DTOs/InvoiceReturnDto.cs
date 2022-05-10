using API.Entities;

namespace API.DTOs
{
    public class InvoiceReturnDto
    {
        public Guid Id { get; set; }
        public CustomerReturnDto Customer { get; set; }
        public string InvoiceNumber { get; set; }
        public string OrderNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public TermReturnDto Terms { get; set; }
        public DateTime DueDate { get; set; }
        public SalesPersonReturnDto SalesPerson { get; set; }
        public string Subject { get; set; }
        public string Currency { get; set; }
        public ICollection<InvoiceItemReturnDto> Items { get; set; }
        public decimal SubTotal { get; set; }
        public int Discount { get; set; }
        public decimal Adjustments { get; set; }
        public string CustomerNotes { get; set; }
        public string TermsAndConditions { get; set; }
        public string AttachFile { get; set; }
        public Boolean Paid { get; set; }
        public decimal Total { get; set; }
    }
}
