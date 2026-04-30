using System.ComponentModel.DataAnnotations;

namespace SchoolAttendance.Api.Models
{
    public class ClassRoom
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        // Navigation property: One ClassRoom has many Students
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}