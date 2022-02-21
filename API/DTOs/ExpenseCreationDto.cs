using API.Entities;

namespace API.DTOs
{
    public class ExpenseCreationDto
    {
        public DateTime Date { get; set; }
        public Guid CategoryId { get; set; }
        public int Amount { get; set; }
        public int Tax { get; set; }
        public int ReferenceNumber { get; set; }
        public string Notes { get; set; }
        public Guid CustomerId { get; set; }
    }
}
