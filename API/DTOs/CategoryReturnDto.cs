using API.Entities;

namespace API.DTOs
{
    public class CategoryReturnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
