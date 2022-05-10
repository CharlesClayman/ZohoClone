using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Expenses:BaseEntity
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        public virtual Category Category { get; set;}
        public string Currency { get; set; }
        public decimal Amount { get; set; }
        public Guid? TaxId { get; set; }
        public virtual Tax Tax { get; set; }
        public string ReferenceNumber { get; set; }
        public string Notes { get; set; }
        public Guid? CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
       

    }
}
