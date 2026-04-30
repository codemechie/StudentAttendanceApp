using System.ComponentModel.DataAnnotations;

namespace SchoolAttendance.Api.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        // Roles: "Admin" or "Teacher"
        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = string.Empty; 

        // If the user is a teacher, they might be assigned to a specific default class
        public int? AssignedClassRoomId { get; set; }
        public ClassRoom? AssignedClassRoom { get; set; }

        public ICollection<AttendanceRecord> AttendanceRecordsMarked { get; set; } = new List<AttendanceRecord>();
    }
}