using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Expenses
    {
        public Guid Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public decimal Amount { get; set; }
        public Guid? TaxId { get; set; }
        public virtual Tax Tax { get; set; }
        public int ReferenceNumber { get; set; }
        public string Notes { get; set; }
        public Guid? CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
       

    }
}
