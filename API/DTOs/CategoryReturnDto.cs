using API.Entities;

namespace API.DTOs
{
    public class CategoryReturnDto
    {
        public Guid Id { get; set; }
        public CustomerType CustomerType { get; set; }
        public string PrimaryContact { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string SkypeNameOrNumber { get; set; }
        public string Designation { get; set; }
        public string Department { get; set; }
        public string Website { get; set; }
        public CustomerOtherDetails OtherDetails { get; set; }
        public List<CustomerContactPerson> Address { get; set; } = new List<CustomerContactPerson>();
        public ICollection<Expenses> Expenses { get; set; } = new HashSet<Expenses>();
        public string Remarks { get; set; }
    }
}
