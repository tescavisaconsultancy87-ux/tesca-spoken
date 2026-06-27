// We need to set up register for ts-paths or require relative since next is ESM/TS.
// We can use a simple node script that mocks/requires the db helper.
const { db } = require('../lib/db');

async function testDbHelper() {
  const coursePayload = {
    id: `test-db-course-${Date.now()}`,
    title: 'Test sanitized Course',
    trainer: 'Sarah Jenkins',
    category: 'Fluency & Pronunciation',
    price: 3499,
    lessonsCount: 15,
    originalPrice: 5999,
    duration: '4 Months',
    level: 'Intermediate',
    accent: 'secondary',
    benefits: 'Learn fluency, Speak well',
    popular: true
  };

  // Convert key naming mapping if needed (like the page does)
  const createdObj = {
    id: coursePayload.id,
    title: coursePayload.title,
    trainer: coursePayload.trainer,
    category: coursePayload.category,
    price: Number(coursePayload.price),
    students_count: 0,
    lessons_count: Number(coursePayload.lessonsCount),
    original_price: Number(coursePayload.originalPrice),
    duration: coursePayload.duration,
    level: coursePayload.level,
    accent: coursePayload.accent,
    benefits: coursePayload.benefits,
    popular: coursePayload.popular,
  };

  console.log('Inserting course via db.createCourse...');
  const res = await db.createCourse(createdObj);
  console.log('Result:', res);

  // Clean up
  console.log('Cleaning up...');
  const deleted = await db.deleteCourse(coursePayload.id);
  console.log('Deleted:', deleted);
}

testDbHelper();
