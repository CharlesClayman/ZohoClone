namespace API.Entities
{
    public class SalesPerson
    {
        public Guid Id { get; set; }
        public virtual Invoice Invoice { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
