namespace API.Entities
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        public Boolean IsDeleted { get; set; }
    }
}
