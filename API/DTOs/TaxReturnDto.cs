namespace API.DTOs
{
    public class TaxReturnDto
    {
        public Guid Id { get; set; }
        public string TaxName { get; set; }
        public int TaxRate { get; set; }
        public bool CompoundTax { get; set; }
    }
}
