namespace API.Entities
{
    public class InvoiceItem:BaseEntity
    {
        public Guid InvoiceId { get; set; }
        public virtual Invoice Invoice { get; set; }
        public Guid ItemId { get; set; }
        public virtual Item Item { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public Guid? TaxId { get; set; }
        public virtual Tax Tax { get; set; }
    }
}
