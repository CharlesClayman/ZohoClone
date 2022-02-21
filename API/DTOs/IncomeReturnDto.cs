using API.Entities;

namespace API.DTOs
{
    public class IncomeReturnDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public int AmountRecieved { get; set; }
        public int BankCharges { get; set; }
        public DateTime PaymentDate { get; set; }
        public int PaymentNumber { get; set; }
        public string PaymentMode { get; set; }
        public string ReferenceNumber { get; set; }
        public TaxDeducted TaxDeducted { get; set; }

    }
}
