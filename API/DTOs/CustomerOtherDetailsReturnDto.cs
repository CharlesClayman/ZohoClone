using API.Entities;

namespace API.DTOs
{
    public class CustomerOtherDetailsReturnDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string Currency { get; set; }
        public TaxReturnDto Tax { get; set; }
        public TermReturnDto Terms { get; set; }
        public EnablePortal EnablePortal { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
    }
}

