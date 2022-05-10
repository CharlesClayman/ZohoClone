namespace API.DTOs
{
    public class ExpenseReturnDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public CategoryReturnDto Category { get; set; }
        public string Currency { get; set; }
        public decimal Amount { get; set; }
        public TaxReturnDto Tax { get; set; }
        public string ReferenceNumber { get; set; }
        public string Notes { get; set; }
        public CustomerReturnDto Customer { get; set; }
    }
}
