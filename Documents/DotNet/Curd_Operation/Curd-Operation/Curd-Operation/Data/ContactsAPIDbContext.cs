using System;
using Curd_Operation.Models;
using Microsoft.EntityFrameworkCore;

namespace Curd_Operation.Data
{
    public class ContactsAPIDbContext : DbContext
    {
        public ContactsAPIDbContext(DbContextOptions<ContactsAPIDbContext> options) : base(options)
        {
        }
        public DbSet<Contacts> Contacts { get; set; }
    }
}

