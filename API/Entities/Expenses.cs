using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Expenses
    {
        public Guid Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public Guid CategoryId { get; set; }
        [Required]
        public Category Category { get; set; }
        public int Amount { get; set; }
        public int Tax { get; set; }
        public int ReferenceNumber { get; set; }
        public string Notes { get; set; }
        public Guid Customerid { get; set; }
        public Customer CustomerName { get; set; }

    }
}
