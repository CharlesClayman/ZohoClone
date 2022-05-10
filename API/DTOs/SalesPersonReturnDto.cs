namespace API.DTOs
{
    public class SalesPersonReturnDto
    {
        public Guid Id { get; set; }
        public InvoiceReturnDto Invoice { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
