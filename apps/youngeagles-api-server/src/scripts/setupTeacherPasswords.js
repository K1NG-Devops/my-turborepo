import bcrypt from 'bcryptjs';
import { query, execute } from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const setupTeacherPasswords = async () => {
  try {
    console.log('🔧 Setting up teacher passwords...');
    
    // Get all teachers from railway database
    const teachers = await query(
      'SELECT id, name, email FROM users WHERE role = "teacher"',
      [],
      'railway'
    );
    
    console.log(`Found ${teachers.length} teachers:`);
    teachers.forEach(teacher => {
      console.log(`- ${teacher.name} (${teacher.email})`);
    });
    
    // Default password for all teachers
    const defaultPassword = 'teacher123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);
    
    console.log('\n🔑 Setting default password: teacher123');
    
    // Update password for each teacher
    for (const teacher of teachers) {
      await execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, teacher.id],
        'railway'
      );
      console.log(`✅ Updated password for ${teacher.name}`);
    }
    
    console.log('\n✨ All teacher passwords have been set!');
    console.log('Teachers can now log in with:');
    console.log('Password: teacher123');
    
    // Also copy teachers to skydek_DB for consistency
    console.log('\n📋 Copying teachers to skydek_DB...');
    
    for (const teacher of teachers) {
      try {
        // Check if teacher already exists in skydek_DB
        const existing = await query(
          'SELECT id FROM users WHERE email = ?',
          [teacher.email],
          'skydek_DB'
        );
        
        if (existing.length === 0) {
          // Insert teacher into skydek_DB
          await execute(
            'INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)',
            [teacher.name, teacher.email, 'teacher', hashedPassword],
            'skydek_DB'
          );
          console.log(`✅ Copied ${teacher.name} to skydek_DB`);
        } else {
          // Update existing teacher
          await execute(
            'UPDATE users SET password = ?, role = ? WHERE email = ?',
            [hashedPassword, 'teacher', teacher.email],
            'skydek_DB'
          );
          console.log(`✅ Updated ${teacher.name} in skydek_DB`);
        }
      } catch (error) {
        console.error(`❌ Error copying ${teacher.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Setup complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error setting up teacher passwords:', error);
    process.exit(1);
  }
};

setupTeacherPasswords();

