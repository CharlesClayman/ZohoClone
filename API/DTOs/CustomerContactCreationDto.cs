﻿using API.Entities;

namespace API.DTOs
{
    public class CustomerContactCreationDto
    {
        public Salutation Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string WorkPhone { get; set; }
        public string Mobile { get; set; }
    }
}
