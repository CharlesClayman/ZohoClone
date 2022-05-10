namespace API.DTOs
{
    public class InvoiceItemCreationDto
    {
        public int Quantity{ get; set; }
        public string Description { get; set; }
        public Guid ItemId { get; set; }
        public Guid? TaxId { get; set; }
    }
}
