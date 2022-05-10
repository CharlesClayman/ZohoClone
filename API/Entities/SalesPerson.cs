namespace API.Entities
{
    public class SalesPerson:BaseEntity
    {
        public virtual ICollection<Invoice> Invoice { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
