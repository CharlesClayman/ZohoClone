﻿using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Items
    {
        public Guid Id { get; set; }
        public ItemType ItemType { get; set; }
        [Required]
        public string Name { get; set; }
        public string Unit { get; set; }
        public int SellingPrice { get; set; }
        public string  Description { get; set; }
        public int Tax { get; set; }
    }
    public enum ItemType
    {
        Goods,
        Service,
    }
}
