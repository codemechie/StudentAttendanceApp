using System.ComponentModel.DataAnnotations;

namespace SchoolAttendance.Api.Models
{
    public class AttendanceRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        // "P" for Present, "A" for Absent (can expand later)
        [Required]
        [MaxLength(1)]
        public string Status { get; set; } = "P";

        [Required]
        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        // The teacher/user who marked this record
        [Required]
        public int MarkedByUserId { get; set; }
        public User MarkedByUser { get; set; } = null!;
    }
}