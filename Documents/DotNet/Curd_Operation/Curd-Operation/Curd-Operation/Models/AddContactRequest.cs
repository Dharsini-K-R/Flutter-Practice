using System;
namespace Curd_Operation.Models
{
	public class AddContactRequest
	{
        public string Name { get; set; }
        public string Email { get; set; }
        public long Phone { get; set; }
        public string Address { get; set; }
    }
}

