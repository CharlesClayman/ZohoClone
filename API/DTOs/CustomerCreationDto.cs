using API.Entities;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CustomerCreationDto
    {
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
        public string Remarks { get; set; }
        public CustomerOtherDetailsCreationDto OtherDetails { get; set; }
        public List<CustomerAddressCreationDto> Address { get; set; }
        public List<CustomerContactCreationDto> ContactPersons { get; set; } 
    }
}
