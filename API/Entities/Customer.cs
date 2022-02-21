using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Customer
    {
        public Guid Id { get; set; }
        public CustomerType CustomerType { get; set; }
        public Salutation Salutation { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        [Required]
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string WorkPhone { get; set; }
        public string MobilePhone { get; set; }
        public string Website { get; set; }
        public CustomerOtherDetails OtherDetails { get; set; }
        public List<CustomerAddress> Address { get; set; } = new List<CustomerAddress>();
        public List<CustomerContactPerson> ContactPersons { get; set; } = new List<CustomerContactPerson>();
        public ICollection<Expenses> Expenses { get; set; } = new HashSet<Expenses>();
        public string Remarks { get; set; }
        public ICollection<Income> Incomes{ get; set; } = new HashSet<Income>();
    }

    public enum CustomerType
    { 
        Business,
        Individual,
    }
    public enum Salutation
    {
        Mr,
        Mrs,
        Ms,
        Miss,
        Dr,
    }

}
