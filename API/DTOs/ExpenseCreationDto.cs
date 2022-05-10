using API.Entities;

namespace API.DTOs
{
    public class ExpenseCreationDto
    {
        public DateTime Date { get; set; }
        public Guid? CategoryId { get; set; }
        public string Currency { get; set; }
        public decimal Amount { get; set; }
        public Guid? TaxId { get; set; }
        public string ReferenceNumber { get; set; }
        public string Notes { get; set; }
        public Guid? CustomerId { get; set; }
    }
}
