using API.Entities;

namespace API.DTOs
{
    public class ItemReturnDto
    {
        public Guid Id { get; set; }
        public ItemType ItemType { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public string Currency { get; set; }
        public int SellingPrice { get; set; }
        public string Description { get; set; }
    }
}
