const fs = require('fs');
// Input student data
const students = [
  {
    id: 1,
    name: "Bhea Flores",
    year: 2,
    course: "BSIT",
    grades: [92, 95, 98],
    enrolled: true
  },
  {
    id: 2,
    name: "Elyzah Sait",
    year: 1,
    course: "BSIT",
    grades: [94, 95, 97],
    enrolled: true
  },
  {
    id: 3,
    name: "Heart Rezaba",
    year: 3,
    course: "BSIT",
    grades: [90, 95, 82],
    enrolled: false
  },
  {
    id: 4,
    name: "Andrea De Leon",
    year: 2,
    course: "BEED",
    grades: [98, 81, 91],
    enrolled: true
  }
];

// Helper to calculate average of an array
const calculateAvg = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

// Transform student data
const processedStudents = students.map((s) => {
  const avgGrade = Number(calculateAvg(s.grades).toFixed(2));
  return {
    id: s.id,
    name: s.name,
    year: s.year,
    course: s.course,
    averageGrade: avgGrade,
    enrolled: s.enrolled,
    academicStatus: s.enrolled ? (avgGrade >= 75 ? "Passed" : "Failed") : "Inactive"
  };
});

// Compute aggregate metrics
const totalStudents = students.length;
const totalEnrolled = students.filter((s) => s.enrolled).length;
const totalUnenrolled = totalStudents - totalEnrolled;

const overallAverage = Number(
  (processedStudents.reduce((sum, s) => sum + s.averageGrade, 0) / totalStudents).toFixed(2)
);

const topPerformer = processedStudents.reduce((top, s) => 
  s.averageGrade > top.averageGrade ? s : top
);

const courseBreakdown = students.reduce((acc, s) => {
  acc[s.course] = (acc[s.course] || 0) + 1;
  return acc;
}, {});

// Assemble full report object
const report = {
  summary: {
    totalStudents,
    totalEnrolled,
    totalUnenrolled,
    overallAverage,
    topPerformer: {
      name: topPerformer.name,
      average: topPerformer.averageGrade
    },
    courseBreakdown
  },
  students: processedStudents
};

// Write output to report.json
fs.writeFileSync('report.json', JSON.stringify(report, null, 2));

console.log('report.json successfully generated!');
