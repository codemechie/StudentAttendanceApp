using Microsoft.EntityFrameworkCore;
using SchoolAttendance.Api.Data;
using SchoolAttendance.Api.Models;

namespace SchoolAttendance.Api.Endpoints
{
    public static class StudentEndpoints
    {
        public static void MapStudentEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/api/students");

            // GET ALL STUDENTS FOR A SPECIFIC CLASS
            group.MapGet("/class/{className}", async (string className, SchoolDbContext db) =>
            {
                var students = await db.Students
                    .Include(s => s.ClassRoom)
                    .Where(s => s.ClassRoom.Name.ToLower() == className.ToLower())
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Sex,
                        s.Age,
                        s.ParentContactInfo,
                        ClassRoom = s.ClassRoom.Name
                    })
                    .ToListAsync();

                return students.Any() ? Results.Ok(students) : Results.NotFound($"No students found in class {className}");
            });

            // DEVELOPMENT ONLY: Seed a class and some students
            group.MapPost("/seed", async (SchoolDbContext db) =>
            {
                if (await db.ClassRooms.AnyAsync()) return Results.BadRequest("Database already seeded!");

                var class8th = new ClassRoom { Name = "8th" };
                db.ClassRooms.Add(class8th);

                var seedStudents = new List<Student>
                {
                    new Student { Name = "Aarav Patel", Age = 13, Sex = "Male", ParentContactInfo = "1234567", ClassRoom = class8th },
                    new Student { Name = "Meera Sharma", Age = 13, Sex = "Female", ParentContactInfo = "1234567", ClassRoom = class8th },
                    new Student { Name = "Rohan Desai", Age = 14, Sex = "Male", ParentContactInfo = "1234567", ClassRoom = class8th }
                };

                db.Students.AddRange(seedStudents);

                // Add a dummy teacher for marking attendance
                db.Users.Add(new User 
                { 
                    Username = "teacher1", 
                    PasswordHash = "password123", // In a real app, hash this properly!
                    FullName = "Jane Doe", 
                    Role = "Teacher",
                    AssignedClassRoom = class8th
                });

                await db.SaveChangesAsync();
                return Results.Ok("Seeded Class 8th, a Teacher, and 3 Students successfully.");
            });
        }
    }
}