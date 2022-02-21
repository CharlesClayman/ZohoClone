using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class ItemCreationDto
    {
       public ItemType Type { get; set; }
        [Required]
        public string Name { get; set; }
        public string Unit { get; set; }
        public int SellingPrice { get; set; }
        public string Description { get; set; }
        public int Tax { get; set; }
    }

}
