-- Migration to drop unused course fields
ALTER TABLE courses DROP COLUMN IF EXISTS level;
ALTER TABLE courses DROP COLUMN IF EXISTS category;
ALTER TABLE courses DROP COLUMN IF EXISTS trainer;
ALTER TABLE courses DROP COLUMN IF EXISTS lessons_count;
