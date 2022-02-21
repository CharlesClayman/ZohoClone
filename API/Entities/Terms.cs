namespace API.Entities
{
    public class Terms
    {
        public Guid Id { get; set; }
        public virtual Invoice Invoice { get; set; }
        public string TermName { get; set; }
        public int TermDays { get; set; }
        public bool Customized { get; set; }
    }
}
