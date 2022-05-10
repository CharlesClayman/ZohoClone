namespace API.DTOs
{
    public class InvoiceUpdateDto:InvoiceCreationDto
    {
        public Boolean Paid { get; set; }
    }
}
