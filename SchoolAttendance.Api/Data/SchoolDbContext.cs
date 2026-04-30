using Microsoft.EntityFrameworkCore;
using SchoolAttendance.Api.Models;

namespace SchoolAttendance.Api.Data
{
    public class SchoolDbContext : DbContext
    {
        public SchoolDbContext(DbContextOptions<SchoolDbContext> options) : base(options)
        {
        }

        // Define the tables that will be generated in SQLite
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<ClassRoom> ClassRooms { get; set; } = null!;
        public DbSet<Student> Students { get; set; } = null!;
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; } = null!;

        // We can override OnModelCreating to explicitly configure relationships 
        // if conventions aren't enough, but EF Core conventions will handle most of ours automatically!
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ensure Username is unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Set up a relation explicitly: One User marked Many AttendanceRecords
            modelBuilder.Entity<AttendanceRecord>()
                .HasOne(a => a.MarkedByUser)
                .WithMany(u => u.AttendanceRecordsMarked)
                .HasForeignKey(a => a.MarkedByUserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascading delete of a teacher from wiping all attendance history
        }
    }
}