namespace API.DTOs
{
    public class InvoiceItemReturnDto
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public ItemReturnDto Item { get; set; }
        public TaxReturnDto Tax { get; set; }
    }
}
