// db/setup.js — Run ONCE to build the full Placement Management System DB
// Usage: node db/setup.js

const { Client } = require('pg');

const credentials = {
  user: 'postgres',
  host: 'localhost',
  password: 'Abhijeet@2004',
  port: 5432,
};

async function setup() {
  // Step 1: Create DB
  const admin = new Client({ ...credentials, database: 'postgres' });
  await admin.connect();
  const dbExists = await admin.query(`SELECT 1 FROM pg_database WHERE datname='placement_tracker'`);
  if (dbExists.rowCount === 0) {
    await admin.query('CREATE DATABASE placement_tracker');
    console.log('✅ Database created.');
  } else {
    console.log('ℹ️  Database already exists.');
  }
  await admin.end();

  // Step 2: Connect and setup schema
  const db = new Client({ ...credentials, database: 'placement_tracker' });
  await db.connect();

  // Drop old tables cleanly
  await db.query(`
    DROP TABLE IF EXISTS applications CASCADE;
    DROP TABLE IF EXISTS companies CASCADE;
    DROP TABLE IF EXISTS students CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS colleges CASCADE;
  `);
  console.log('🧹 Dropped old tables.');

  // Colleges
  await db.query(`
    CREATE TABLE colleges (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Users
  await db.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('owner','admin','student')),
      college_id INT REFERENCES colleges(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Students (extended profile)
  await db.query(`
    CREATE TABLE students (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      enrollment VARCHAR(100),
      course VARCHAR(100),
      branch VARCHAR(100),
      division VARCHAR(10),
      tenth_percent NUMERIC(5,2) DEFAULT 0,
      twelfth_percent NUMERIC(5,2) DEFAULT 0,
      cgpa NUMERIC(4,2) DEFAULT 0
    );
  `);

  // Companies
  await db.query(`
    CREATE TABLE companies (
      id SERIAL PRIMARY KEY,
      college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
      name VARCHAR(200) NOT NULL,
      role VARCHAR(200) NOT NULL,
      package VARCHAR(100),
      jd TEXT,
      min_10 NUMERIC(5,2) DEFAULT 0,
      min_12 NUMERIC(5,2) DEFAULT 0,
      min_cgpa NUMERIC(4,2) DEFAULT 0,
      allowed_branches TEXT[],
      allowed_courses TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Applications
  await db.query(`
    CREATE TABLE applications (
      id SERIAL PRIMARY KEY,
      student_id INT REFERENCES students(id) ON DELETE CASCADE,
      company_id INT REFERENCES companies(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'Applied' CHECK (status IN ('Applied','Interview','Selected','Rejected')),
      interview_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(student_id, company_id)
    );
  `);

  console.log('✅ All tables created.');

  // Seed Colleges
  await db.query(`INSERT INTO colleges (name) VALUES ('Pune University'),('MIT College, Aurangabad');`);

  // Seed Users
  await db.query(`
    INSERT INTO users (name, email, password, role, college_id) VALUES
      ('Super Owner', 'owner@tracker.com', '123', 'owner', NULL),
      ('College Admin', 'admin@tracker.com', '123', 'admin', 1),
      ('Rahul Sharma', 'student@tracker.com', '123', 'student', 1);
  `);

  // Seed Student Profile
  await db.query(`
    INSERT INTO students (user_id, enrollment, course, branch, division, tenth_percent, twelfth_percent, cgpa)
    VALUES (3, 'EN2021001', 'BTech', 'CE', 'A', 88.5, 82.0, 8.5);
  `);

  // Seed Companies
  await db.query(`
    INSERT INTO companies (college_id, name, role, package, jd, min_10, min_12, min_cgpa, allowed_branches, allowed_courses)
    VALUES
      (1, 'TechCorp', 'SDE Intern', '6 LPA', 'Full-stack development internship. 6 months. Work on live projects.', 75, 70, 7.5, ARRAY['CE','IT'], ARRAY['BTech','MCA']),
      (1, 'Infosys', 'Systems Engineer', '3.6 LPA', 'Systems engineering role. Training + placement program.', 60, 60, 6.0, ARRAY['CE','IT','ECE'], ARRAY['BTech','BCA']),
      (1, 'Wipro', 'Project Engineer', '3.5 LPA', 'Project engineering and client delivery role.', 65, 65, 6.5, ARRAY['CE','IT'], ARRAY['BTech']),
      (1, 'HCL', 'Software Developer', '4 LPA', 'Product development for enterprise clients.', 55, 55, 5.5, ARRAY['CE','IT','ME'], ARRAY['BTech','BCA','MCA']);
  `);

  console.log('✅ Seed data inserted.');
  await db.end();
  console.log('\n🎉 Setup complete! Run: node index.js');
}

setup().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
