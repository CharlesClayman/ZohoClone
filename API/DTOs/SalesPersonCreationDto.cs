namespace API.DTOs
{
    public class SalesPersonCreationDto
    {   
        public Guid InvoiceId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
