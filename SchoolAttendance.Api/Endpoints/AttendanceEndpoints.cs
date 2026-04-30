using Microsoft.EntityFrameworkCore;
using SchoolAttendance.Api.Data;
using SchoolAttendance.Api.Models;

namespace SchoolAttendance.Api.Endpoints
{
    public static class AttendanceEndpoints
    {
        public static void MapAttendanceEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/attendance");

            // SUBMIT BATCH ATTENDANCE FOR A CLASS TODAY
            group.MapPost("/submit", async (List<AttendanceInput> records, SchoolDbContext db) =>
            {
                if (!records.Any()) return Results.BadRequest("No attendance records provided.");

                // Example: the frontend passes us a list of { StudentId = 1, Status = "A", MarkedByUserId = 1 }
                var dateToday = DateTime.UtcNow.Date;

                foreach (var input in records)
                {
                    // Basic sanity check: Does this student actually exist?
                    var student = await db.Students.FindAsync(input.StudentId);
                    if (student == null) continue;

                    // Add new Attendance Record row
                    var dbRecord = new AttendanceRecord
                    {
                        StudentId = input.StudentId,
                        MarkedByUserId = input.MarkedByUserId,
                        Status = input.Status.ToUpper(), // "P" or "A"
                        Date = dateToday
                    };
                    db.AttendanceRecords.Add(dbRecord);
                }

                await db.SaveChangesAsync();

                // TODO: Step 5 - Integrate Twilio right here to text Parents of Absent Students!

                return Results.Ok($"Saved {records.Count} attendance records for today.");
            });

            // GET ATTENDANCE HISTORY FOR A SPECIFIC CLASS
            group.MapGet("/history/{className}", async (string className, SchoolDbContext db) =>
            {
                var targetClass = await db.ClassRooms.FirstOrDefaultAsync(c => c.Name.ToLower() == className.ToLower());
                if (targetClass == null) return Results.NotFound("Class not found.");

                // Group attendance by Date globally to see Present vs Absent totals securely
                var history = await db.AttendanceRecords
                    .Include(a => a.Student)
                    .Where(a => a.Student.ClassRoomId == targetClass.Id)
                    .GroupBy(a => a.Date)
                    .Select(g => new
                    {
                        Date = g.Key.ToString("MMM dd, yyyy"),
                        TotalPresent = g.Count(a => a.Status == "P"),
                        TotalAbsent = g.Count(a => a.Status == "A"),
                        AbsentStudents = g.Where(a => a.Status == "A").Select(a => a.Student.Name).ToList()
                    })
                    .OrderByDescending(h => h.Date) // Show newest first
                    .ToListAsync();

                return Results.Ok(history);
            });
        }
    }

    public class AttendanceInput
    {
        public int StudentId { get; set; }
        public int MarkedByUserId { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}