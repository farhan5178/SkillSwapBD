const { spawn } = require('child_process');

const envs = {
  NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyAMdFs8lXZQglVO_omW7pfeHg8BPUS7ZuA",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "skillswapbd.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "skillswapbd",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "skillswapbd.firebasestorage.app",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "769159823700",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:769159823700:web:d2ad308e63b39660a3c8c1"
};

async function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    console.log(`Adding ${key}...`);
    // Remove it first just in case
    const rm = spawn('npx', ['vercel', 'env', 'rm', key, 'production', '-y'], { shell: true });
    rm.on('close', () => {
      const p = spawn('npx', ['vercel', 'env', 'add', key, 'production'], { shell: true });
      p.stdout.on('data', d => console.log(d.toString()));
      p.stderr.on('data', d => console.log(d.toString()));
      p.stdin.write(value + '\n');
      p.stdin.end();
      p.on('close', resolve);
    });
  });
}

async function run() {
  for (const [key, value] of Object.entries(envs)) {
    await addEnv(key, value);
  }
}

run();
