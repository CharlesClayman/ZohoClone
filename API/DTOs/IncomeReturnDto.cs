using API.Entities;

namespace API.DTOs
{
    public class IncomeReturnDto
    {
        public Guid Id { get; set; }
        public string Currency { get; set; }
        public decimal AmountReceived { get; set; }
        public decimal BankCharges { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentNumber { get; set; }
        public string PaymentMode { get; set; }
        public string ReferenceNumber { get; set; }
        public TaxDeducted TaxDeducted { get; set; }
        public CustomerReturnDto Customer { get; set; }
        public InvoiceReturnDto Invoice { get; set; }
        public string Notes { get; set; }
        public string UploadFile { get; set; }

    }
}
