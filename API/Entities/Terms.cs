namespace API.Entities
{
    public class Terms:BaseEntity
    {
        public virtual ICollection<Invoice> Invoices { get; set; }
        public string TermName { get; set; }
        public int TermDays { get; set; }
        public bool Customized { get; set; }
    }
}
