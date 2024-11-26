import { execSync } from 'child_process';
import sequelize from './src/config/database.js';
import User from './src/models/User.js';
import fs from 'fs';
import path from 'path';

async function setupProject() {
  console.log('🚀 Setting up your project...');

  // Create uploads directory
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
    console.log('✅ Created uploads directory');
  }

  // Test database connection
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nPlease check your PostgreSQL installation and credentials in .env file');
    process.exit(1);
  }

  // Sync database models
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');

    // Create default admin user
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User'
    });
    console.log('✅ Default admin user created');
    console.log('\n📝 Admin Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }

  console.log('\n🎉 Setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the server: npm run dev');
  console.log('2. Visit: http://localhost:3000/admin');
  console.log('3. Log in with the admin credentials above');
}

setupProject();