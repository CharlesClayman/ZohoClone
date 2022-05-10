using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class InvoiceCreationDto
    {
        public Guid CustomerId { get; set; }
        public string InvoiceNumber { get; set; }
        public string OrderNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public Guid? TermsId { get; set; }
        public DateTime DueDate { get; set; }
        public Guid? SalesPersonId { get; set; }
        public string Subject { get; set; }
        public string Currency { get; set; }
        public ICollection<InvoiceItemCreationDto> Items { get; set; } //
        public decimal SubTotal { get; set; }
        public int Discount { get; set; }
        public decimal Adjustments { get; set; }
        public string CustomerNotes { get; set; }
        public string TermsAndConditions { get; set; }
        public string AttachFile { get; set; }
        public decimal Total { get; set; }

    }
}
