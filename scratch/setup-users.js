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
    env[match[1]] = value.trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env!');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setup() {
  try {
    console.log('Connecting to Supabase at:', url);

    const targetUsers = [
      {
        email: 'tescavisaconsultancy87@gmail.com',
        password: 'Tesca@2005',
        role: 'admin',
        name: 'Admin User'
      },
      {
        email: 'tutor@gmail.com',
        password: 'tutor@123',
        role: 'tutor',
        name: 'Tutor User'
      },
      {
        email: 'dhameliyaavadh592@gmail.com',
        password: 'Avadh@9265',
        role: 'student',
        name: 'Student User'
      }
    ];

    // 1. Fetch all profile IDs and delete them
    console.log('\nFetching current profile list to delete existing users...');
    const { data: profiles, error: profileFetchError } = await supabase
      .from('profiles')
      .select('id, email');
      
    if (profileFetchError) {
      throw profileFetchError;
    }

    console.log(`Found ${profiles.length} profiles in database.`);

    for (const p of profiles) {
      console.log(`Deleting Auth user: ${p.email} (ID: ${p.id})...`);
      const { error: delError } = await supabase.auth.admin.deleteUser(p.id);
      if (delError) {
        console.warn(`Auth delete failed for ${p.email} (${delError.message}), trying direct profiles delete...`);
        await supabase.from('profiles').delete().eq('id', p.id);
      } else {
        console.log(`Successfully deleted auth user & profile for ${p.email}`);
      }
    }

    // 2. Explicitly clear our three target emails using generateLink to find their IDs
    console.log('\nChecking target emails explicitly to clear duplicates...');
    for (const t of targetUsers) {
      try {
        console.log(`Checking if ${t.email} exists in Auth via generateLink...`);
        const { data, error } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: t.email
        });
        
        if (data && data.user) {
          console.log(`Found existing user: ${t.email} (ID: ${data.user.id}). Deleting...`);
          const { error: delError } = await supabase.auth.admin.deleteUser(data.user.id);
          if (delError) {
            console.error(`Failed to delete ${t.email}:`, delError.message);
          } else {
            console.log(`Successfully deleted existing ${t.email}`);
          }
        } else if (error) {
          console.log(`Email check for ${t.email} returned: ${error.message}`);
        }
      } catch (checkErr) {
        console.log(`Clean check for ${t.email} passed (user does not exist).`);
      }
    }

    // 3. Create the users and profiles
    console.log('\nCreating new users...');
    for (const t of targetUsers) {
      console.log(`\nCreating Auth user: ${t.email} with role: ${t.role}...`);
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email: t.email,
        password: t.password,
        email_confirm: true,
        user_metadata: {
          role: t.role,
          name: t.name
        }
      });

      if (createError) {
        console.error(`Failed to create Auth user ${t.email}:`, createError.message);
        continue;
      }

      console.log(`Auth user created successfully! ID: ${user.id}`);

      // Explicitly upsert/insert the profile row
      console.log(`Upserting profile for ${t.email}...`);
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: t.email,
        role: t.role,
        name: t.name,
        needs_password_change: false
      });

      if (profileError) {
        console.error(`Failed to upsert profile for ${t.email}:`, profileError.message);
      } else {
        console.log(`Profile created successfully for ${t.email}!`);
      }
    }

    console.log('\nAll operations completed successfully!');
  } catch (err) {
    console.error('Fatal error during setup:', err);
    process.exit(1);
  }
}

setup();
