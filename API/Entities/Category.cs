﻿namespace API.Entities
{
    public class Category:BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Expenses> Expenses { get; set; } = new HashSet<Expenses>();
    }
}
