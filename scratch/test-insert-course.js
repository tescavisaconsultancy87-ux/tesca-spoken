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

async function testValid() {
  const testId = `test-inspect-${Date.now()}`;
  console.log('Inserting schema-valid course...');
  
  const course = {
    id: testId,
    title: 'Candidate Course',
    trainer: 'Sarah Jenkins',
    category: 'Fluency & Pronunciation',
    price: 2999,
    lessons_count: 10
  };
  
  const { data, error } = await supabase.from('courses').insert(course).select();
  
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert succeeded! Row data:', data[0]);
    
    // Clean up
    await supabase.from('courses').delete().eq('id', testId);
  }
}

testValid();
