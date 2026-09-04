const { execSync } = require('child_process');
execSync('psql -U postgres -h localhost -p 5433 -c "CREATE DATABASE shadow_db;"', { stdio: 'inherit' });
