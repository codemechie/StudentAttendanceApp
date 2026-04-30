using System.ComponentModel.DataAnnotations;

namespace SchoolAttendance.Api.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string Sex { get; set; } = string.Empty;

        [Required]
        public int Age { get; set; }

        [Required]
        [MaxLength(20)]
        public string ParentContactInfo { get; set; } = string.Empty;

        // Foreign Key to the Classroom
        [Required]
        public int ClassRoomId { get; set; }
        public ClassRoom ClassRoom { get; set; } = null!;

        // Navigation property
        public ICollection<AttendanceRecord> AttendanceRecords { get; set; } = new List<AttendanceRecord>();
    }
}