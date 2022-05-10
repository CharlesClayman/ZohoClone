using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class CustomerOtherDetails:BaseEntity
    {
        public Guid CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public string Currency { get; set; }
        public Guid? TaxId { get; set; }
        public virtual Tax Tax { get; set; }
        public Guid? TermsId { get; set; }
        public virtual Terms Terms { get; set; }
        public EnablePortal EnablePortal { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
       
    }
    public enum EnablePortal
    {
        Yes,
        No,
    }
}
