using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class TaxCreationDto
    {   
        [Required]
        public string TaxName { get; set; }
        [Required]
        public int TaxRate { get; set; }
        public bool CompoundTax { get; set; }
       
    }
}
