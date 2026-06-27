const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, key);

async function checkTable(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
      console.error(`Error checking ${tableName}:`, error.message);
      return;
    }
    console.log(`\nTable "${tableName}": ${data.length} rows`);
    data.forEach((row, i) => {
      console.log(`  Row ${i}: id="${row.id}", keys:`, Object.keys(row).filter(k => row[k] === null || row[k] === ''));
    });
  } catch (err) {
    console.error(`Failed to check ${tableName}:`, err);
  }
}

async function run() {
  const tables = [
    'profiles',
    'courses',
    'enrollments',
    'live_classes',
    'study_materials',
    'payments',
    'leads',
    'testimonials',
    'blog_posts'
  ];
  for (const table of tables) {
    await checkTable(table);
  }
}

run();
