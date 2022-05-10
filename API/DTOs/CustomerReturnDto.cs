using API.Entities;

namespace API.DTOs
{
    public class CustomerReturnDto
    {
        public Guid Id { get; set; }
        public CustomerType CustomerType { get; set; }
        public Salutation Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string WorkPhone { get; set; }
        public string MobilePhone { get; set; }
        public string Website { get; set; }
        public string Remarks { get; set; }
        public CustomerOtherDetailsReturnDto OtherDetails { get; set; }
        public List<CustomerAddressReturnDto> Address { get; set; }
        public List<CustomerContactReturnDto> ContactPersons { get; set; }
    }

}