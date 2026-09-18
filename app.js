const fs = require("fs");

// Read students.json
const students = JSON.parse(
    fs.readFileSync("students.json", "utf8")
);


// 1. Get average grade
function getAverageGrade(student) {
    if (!student.grades || student.grades.length === 0) {
        return 0;
    }

    return student.grades.reduce(
        (sum, grade) => sum + grade,
        0
    ) / student.grades.length;
}


// 2. Get top students
function getTopStudents(students, n) {
    if (n < 0) {
        throw new Error("Number of students cannot be negative.");
    }

    return students
        .map(student => ({
            ...student,
            averageGrade: getAverageGrade(student)
        }))
        .sort((a, b) => b.averageGrade - a.averageGrade)
        .slice(0, n);
}


// 3. Group students by course
function groupByCourse(students) {
    return students.reduce((groups, student) => {
        if (!groups[student.course]) {
            groups[student.course] = [];
        }

        groups[student.course].push({ ...student });

        return groups;
    }, {});
}


// 4. Get enrolled count
function getEnrolledCount(students) {
    return students.reduce(
        (count, student) => {
            if (student.enrolled) {
                count.enrolled++;
            } else {
                count.notEnrolled++;
            }

            return count;
        },
        {
            enrolled: 0,
            notEnrolled: 0
        }
    );
}


// 5. Find student by name
function findStudent(students, name) {
    const student = students.find(
        student =>
            student.name.toLowerCase() === name.toLowerCase()
    );

    return student ? { ...student } : null;
}


// 6. Get course averages
function getCourseAverages(students) {
    const grouped = groupByCourse(students);

    return Object.entries(grouped)
        .map(([course, courseStudents]) => {
            const averages = courseStudents
                .map(student => getAverageGrade(student))
                .filter(average => average > 0);

            const averageGrade =
                averages.length > 0
                    ? averages.reduce(
                        (sum, grade) => sum + grade,
                        0
                    ) / averages.length
                    : 0;

            return {
                course,
                averageGrade
            };
        })
        .sort((a, b) => b.averageGrade - a.averageGrade);
}


// 7. Export summary
function exportSummary(students) {
    const allGrades = students.flatMap(
        student => student.grades || []
    );

    const overallAverage =
        allGrades.length > 0
            ? allGrades.reduce(
                (sum, grade) => sum + grade,
                0
            ) / allGrades.length
            : 0;

    const topStudents = getTopStudents(students, 1);

    return {
        totalStudents: students.length,
        overallAverage: overallAverage,
        topPerformingStudent:
            topStudents.length > 0
                ? topStudents[0]
                : null,
        breakdownByCourse: getCourseAverages(students)
    };
}


// MAIN FUNCTION
function main() {
    console.log("====================================");
    console.log("       STUDENT RECORDS REPORT");
    console.log("====================================");

    console.log("\nTotal Students:");
    console.log(students.length);


    console.log("\nOverall Average Grade:");
    const summary = exportSummary(students);
    console.log(summary.overallAverage.toFixed(2));


    console.log("\nEnrollment:");
    const enrolled = getEnrolledCount(students);
    console.log("Enrolled:", enrolled.enrolled);
    console.log("Not Enrolled:", enrolled.notEnrolled);


    console.log("\nTop Performing Students:");

    const topStudents = getTopStudents(students, 3);

    topStudents.forEach((student, index) => {
        console.log(
            `${index + 1}. ${student.name} - ${student.averageGrade.toFixed(2)}`
        );
    });


    console.log("\nAverage Grade by Course:");

    const courseAverages = getCourseAverages(students);

    courseAverages.forEach(course => {
        console.log(
            `${course.course}: ${course.averageGrade.toFixed(2)}`
        );
    });


    console.log("\nComplete Summary:");
    console.log(JSON.stringify(summary, null, 2));


    // Optional stretch goal
    fs.writeFileSync(
        "report.json",
        JSON.stringify(summary, null, 2)
    );

    console.log("\nReport saved as report.json");
}


main();
