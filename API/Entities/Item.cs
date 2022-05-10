using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Item:BaseEntity
    {
        public ItemType ItemType { get; set; }
        [Required]
        public string Name { get; set; }
        public string Unit { get; set; }
        public string Currency { get; set; }
        public decimal SellingPrice { get; set; }
        public string  Description { get; set; }
        public  ICollection<InvoiceItem> Invoice { get; set; } = new HashSet<InvoiceItem>();
    }
    public enum ItemType
    {
        Goods,
        Service,
    }
}
