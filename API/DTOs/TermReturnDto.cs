namespace API.DTOs
{
    public class TermReturnDto
    {   
        public Guid Id { get; set; }
        public string TermName { get; set; }
        public int TermDays { get; set; }
        public bool Customized { get; set; }
    }
}
