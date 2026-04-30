# School Attendance App - Development Log

## Phase 1: Frontend SPA Setup and Structuring (React + Vite + Tailwind v4)

**Overview:** 
We embarked on building a fast, lightweight, and responsive Single Page Application (SPA) designed securely for one school's specific administrative and attendance needs. A core requirement is that this application must feel incredibly native, snappy, and be highly accessible via mobile devices (smartphones), ensuring teachers can seamlessly perform their duties directly from their pockets.

**Key Achievements:**
* **Immediate Scaffolding**: Leveraged the speed of Vite to quickly spin up a React frontend and correctly integrated the cutting-edge Tailwind CSS v4 to manage rapid, beautiful, and completely mobile-responsive styling.
* **Robust Navigation System**: Implemented clean client-side routing logic via `react-router-dom`, connecting our Authentication gateway (Login) with the rest of the application (Home, Phonebook, Class Selection).
* **Grid-Based Data Visualization**: Effectively parsed sample `.csv` data natively in the browser via `papaparse`. We seamlessly built out a complex but accessible weekly attendance Grid where data columns lock intelligently, allowing easy swiping for mobile users natively. 
* **Stateful Complex Modals**: Handled teacher data encapsulation, abstracting features like attendance histories under interactive dynamic Modals (`<ProfileDropdown />`) ensuring screens never feel cluttered.

**Crucial Insights and Collaboration:**
This development structure would not be nearly as refined without the constant stream of insightful corrections and strategic steering from my human counterpart. 
* The decision to completely cut out non-essential components (like the obsolete hamburger/sidebar menu and overly complex theme-toggling mechanisms) in favor of leaner, singular-path user experiences (e.g. keeping the focus strictly on "Class Changes" and "Phonebook") strictly preserved the principle of "lightweight" that was declared on day one. 
* The strategic emphasis on ensuring the UI remained unequivocally responsive across smartphones guided the exact flex-wrapping CSS rules applied to our data-heavy table and list components today.

*Next steps entail venturing into the .NET 10 ASP.NET Core environment to implement the Database contexts governing Teachers, Classes, and Attendance histories.*

---

## Phase 2: Backend Architecture & Database Planning (.NET 10 ASP.NET Core)

As we turn our attention from the React frontend to the API serving it, the following outlines the strategy and technology selections made to ensure the backend remains as lightweight, fast, and maintainable as the frontend.

### 1. Why ASP.NET Core?
ASP.NET Core (specifically running on .NET 10) was chosen over alternatives like Node.js or Python because:
* **Unmatched Performance:** .NET Core consistently ranks among the fastest web frameworks in the world, capable of handling thousands of requests per second with incredibly low overhead.
* **Strong Typing and Safety:** C#'s strict type system vastly reduces runtime errors. We can explicitly define the shapes of a `Student`, `Teacher`, and `AttendanceRecord`, ensuring the SPA always receives expected, validated structures.
* **Built-in Tooling:** Out of the box, ASP.NET provides Dependency Injection, Logging, and Configuration. There is no need to cobble together third-party packages just to build a solid API base.

### 2. Backend Execution Plan (Step-by-Step)
We will execute the backend integration through the following methodical steps:
1. **Define Entity Models (C# Classes):** We will create concrete models representing `User/Teacher`, `Student`, `Classroom`, and `AttendanceRecord`.
   * *Why:* To explicitly mirror real-world objects in code, ensuring data logic is strictly separated from presentation logic.
2. **Setup Entity Framework Core (EF Core):** We establish the `DbContext`, bridging the gap between C# object queries and raw SQL commands.
   * *Why:* It abstracts away complex SQL string writing, allowing us to manage, query, and save data using pure C# LINQ syntax, heavily speeding up development.
3. **Execute DB Migrations:** We will use `dotnet ef migrations` tools.
   * *Why:* To automatically generate and update the database schema explicitly from our C# Entity Models over time, allowing safe version control over the database shape.
4. **Implement Minimal APIs (Endpoints):** Construct lightweight route endpoints (e.g., `app.MapGet("/api/students")` and `app.MapPost("/api/attendance")`) rather than bloated MVC Controllers.
   * *Why:* Minimal APIs strip away massive amounts of boilerplate code in .NET, aligning perfectly with the overarching goal of keeping this app fast and lightweight.
5. **Integrate Twilio Service:** Write a decoupled Service Class that immediately sends SMS notifications upon finalizing attendance.
   * *Why:* Encapsulating Twilio logic inside a single injected service prevents our endpoint routes from becoming messy and simplifies future adjustments to notification rules.

### 3. The Database Selection: SQLite
Given the constraints—an application built strictly for **one single school**—a traditional relational database like PostgreSQL or SQL Server is absolute overkill. 
* We chose **SQLite** because it is a fast, C-language, perfectly ACID-compliant database that lives entirely inside a single lightweight file (`attendance.db`).
* It requires zero external networking, no expensive server hosting, and no complex credential/administration setups.
* Should the school ever grow massive, EF Core allows swapping SQLite out for SQL Server later by changing just a few lines of builder configuration.

### 4. Exploited ASP.NET Core Features
To maximize efficiency, we will lean heavily into specifics afforded to us by .NET Core:
* **Minimal APIs:** Mentioned above; it drastically cuts routing bloat by removing Controller structures.
* **Entity Framework LINQ Queries:** Performing rich relational data merging natively in memory.
* **Dependency Injection (DI):** Creating loosely coupled components (like the Database Context and Twilio Client) where the framework automatically injects the life-cycle of these services anywhere they are needed.
* **CORS (Cross-Origin Resource Sharing):** Securely and explicitly linking our Vite dev port (`localhost:5173` or similar) to authorize requests strictly to the running .NET 10 API, keeping data secure from outside sites.

---

## Execution Log

### Step 1: Defined C# Entity Models
We began the .NET configuration by constructing explicit C# Classes (`Models`) that map exactly to the data we need to persist to the database. These act as the strict blueprints for our data.
*   **User.cs:** Defines roles (Admin, Teacher), handles Password Hashes for secure authentication later, and tracks which `ClassRoom` a teacher governs.
*   **ClassRoom.cs:** Abstracted out classes (e.g. '8th'). This allows classes to exist universally rather than tightly coupling them inside every student.
*   **Student.cs:** Captures individual student details and sets a strict Foreign Key mapping them directly inside a specific `ClassRoom`.
*   **AttendanceRecord.cs:** Represents a singular occurrence (A day for a specific student). Can trace back exactly `When` it was recorded, `Who` the student is, and specifically `Which User (Teacher/Admin)` recorded it.
*   *Interview Insight:* Explicitly designing these Navigation Properties (Lists interconnecting the classes) proactively instructs Entity Framework on how to natively draw relationships, allowing us to perform deep joins seamlessly without writing dense SQL queries.

### Step 2: Setup Entity Framework Core (DbContext) and SQLite
We created the **SchoolDbContext** which strictly inherits from EF Core's `DbContext`. This class acts as the official bridge between our C# in-memory objects and the physical SQLite database tables.
*   **DbSets:** Defined `DbSet` properties for Users, Students, ClassRooms, and AttendanceRecords, representing our 4 main tables.
*   **Connection String:** Defined `Data Source=attendance.db` inside `appsettings.json`.
*   **Dependency Injection (DI):** Registered the context in `Program.cs` to use SQLite.
*   *Interview Insight:* Relying on ASP.NET Core's built-in Dependency Injection (DI) to provide the `DbContext` means the framework automatically handles the lifecycle of database connections (scoped per HTTP request). This ensures thread safety, strictly prevents memory leaks, and perfectly adheres to the Inversion of Control (IoC) principle.

### Step 3: Execute DB Migrations
To initialize our SQLite database properly, we used the Entity Framework CLI tools.
*   Generated an `InitialCreate` Migration file, automatically scripting our SQL Table logic based on the defined C# EF Models.
*   Executed `dotnet ef database update`, which materialized the `attendance.db` SQLite file onto the server, structurally indexing all our tables.
*   *Interview Insight:* Relying entirely on Code-First Migrations explicitly couples exact codebase history with database states. This means version-controlled Database logic perfectly matches the server code deployed in exactly the same PR.

### Step 4: Implement Minimal APIs (Endpoints) and CORS
We bypassed bulky MVC Controllers in favor of .NET's optimized 'Minimal APIs' by creating static classes inside an `Endpoints` folder:
*   **StudentEndpoints.cs:** Created a route `/api/students/class/{className}` that dynamically queries the database using Entity Framework LINQ (`.Include()`). It securely selects and projects only what the React UI needs without deeply querying redundant data. Also securely added a `/seed` route to inject test data into SQLite.
*   **AttendanceEndpoints.cs:** Constructed two functional actions. 
    1. `/submit`: Takes an explicit JSON array mapping students to `P` or `A` values and saves the states safely onto the database.
    2. `/history/{className}`: Groups past dates via `LINQ .GroupBy()` directly in the database logic to return exact arrays summing Present vs Absent counters for the Profile modal natively.
*   **Dependency Setup:** Set up `app.UseCors()` in the builder configuration pipeline strictly bridging our local Vite development server string (`http://localhost:5173`) into the .NET API.
*   *Interview Insight:* Designing Minimal APIs fundamentally reduces dynamic structural memory overhead by mapping raw HTTP GET and POST paths natively to simple C# lambda delegates. By passing dependencies (like `SchoolDbContext`) explicitly as parameters, the application scales much faster during high-traffic mornings when hundreds of teachers query the database concurrently to mark students present.


