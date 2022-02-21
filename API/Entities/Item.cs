using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Item
    {
        public Guid Id { get; set; }
        public ItemType ItemType { get; set; }
        [Required]
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal SellingPrice { get; set; }
        public string  Description { get; set; }
        public Guid? TaxId { get; set; }
        public virtual Tax Tax { get; set; }
        public virtual Invoice Invoice { get; set; }
    }
    public enum ItemType
    {
        Goods,
        Service,
    }
}
