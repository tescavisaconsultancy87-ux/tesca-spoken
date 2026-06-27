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

async function testInsert() {
  const lc = {
    id: `test-lc-${Date.now()}`,
    topic: 'Test Live Class Topic',
    trainer: 'Sarah Jenkins',
    date_time: new Date().toISOString(),
    duration: '60 mins',
    join_url: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming'
  };
  
  console.log('Attempting insert with status...');
  const { data, error } = await supabase.from('live_classes').insert(lc).select();
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert succeeded! Row data:', data);
    
    // Clean up
    console.log('Cleaning up...');
    const { error: delError } = await supabase.from('live_classes').delete().eq('id', lc.id);
    if (delError) {
      console.error('Cleanup failed:', delError);
    } else {
      console.log('Cleanup succeeded.');
    }
  }
}

testInsert();
