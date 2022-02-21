using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Tax
    {
        public Guid Id { get; set; }
        [Required]
        public string TaxName { get; set; }
        [Required]
        public int TaxRate { get; set; }
        public bool CompoundTax { get; set; }
        public virtual Expenses Expenses { get; set; }
        public virtual Invoice Invoice { get; set; }
        public virtual CustomerOtherDetails CustomerOtherDetails { get; set; }
        public virtual Item Item { get; set; }
    }

}
