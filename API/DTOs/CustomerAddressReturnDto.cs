using API.Entities;

namespace API.DTOs
{
    public class CustomerAddressReturnDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public AddressType AddressType { get; set; }
        public string Attention { get; set; }
        public string CountryOrRegion { get; set; }
        public string StreetOneAddress { get; set; }
        public string StreetTwoAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
    }
}
