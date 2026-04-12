/**
 * QuantSun Database Seed Script
 * Populates Supabase with courses, creating one post per subject category
 * and inserting all courses as resources.
 *
 * Run: node scripts/seed.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.trim() && line.includes('='))
    .map(line => {
      const eqIdx = line.indexOf('=');
      const key = line.slice(0, eqIdx).trim();
      const val = line.slice(eqIdx + 1).trim().replace(/^"(.*)"$/, '$1');
      return [key, val];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Subject post definitions
const SUBJECT_POSTS = {
  'Comp Sci': {
    id: 'seed-post-compsci',
    title: 'Best Computer Science Resources & Courses',
    description: 'A curated collection of top Computer Science courses from MIT, Stanford, Carnegie Mellon, and other leading institutions. Covers algorithms, data structures, computer architecture, probability, computational thinking, and systems programming.',
    subject: 'Computer Science',
    topics: 'algorithms,data structures,computer architecture,probability,computational thinking,systems',
    authorName: 'QuantSun',
  },
  'Machine Learning': {
    id: 'seed-post-ml',
    title: 'Best Machine Learning & AI Resources',
    description: 'Comprehensive collection of Machine Learning and AI courses from top universities. Covers deep learning, neural networks, NLP, computer vision, reinforcement learning, and statistical learning theory.',
    subject: 'Machine Learning',
    topics: 'deep learning,neural networks,NLP,computer vision,reinforcement learning,statistics',
    authorName: 'QuantSun',
  },
  'Programming': {
    id: 'seed-post-prog',
    title: 'Best Programming & Software Engineering Resources',
    description: 'Top programming courses covering Python, C++, algorithms, data structures, software engineering, and competitive programming. Essential for aspiring quant developers and software engineers.',
    subject: 'Programming',
    topics: 'Python,C++,algorithms,data structures,software engineering,competitive programming',
    authorName: 'QuantSun',
  },
  'Mathematics': {
    id: 'seed-post-math',
    title: 'Best Mathematics Resources for Quant Finance',
    description: 'Essential mathematics courses for quantitative finance: linear algebra, calculus, real analysis, stochastic calculus, differential equations, and optimization from MIT, Stanford, and other top schools.',
    subject: 'Mathematics',
    topics: 'linear algebra,calculus,real analysis,stochastic calculus,differential equations,optimization',
    authorName: 'QuantSun',
  },
  'Finance & Economics': {
    id: 'seed-post-finance',
    title: 'Best Finance & Economics Resources',
    description: 'Curated finance and economics courses covering quantitative finance, financial derivatives, econometrics, portfolio theory, market microstructure, and behavioral finance from top institutions.',
    subject: 'Finance & Economics',
    topics: 'quantitative finance,derivatives,econometrics,portfolio theory,market microstructure,behavioral finance',
    authorName: 'QuantSun',
  },
};

function courseToResource(course, postId) {
  const url = course.playlistUrl || course.link || '';
  const description = [
    course.institution ? `${course.institution}` : '',
    course.code ? `(${course.code})` : '',
    course.source ? `• ${course.source}` : '',
    course.priority ? `• Priority: ${course.priority}` : '',
    course.lectures ? `• Lectures: ${course.lectures}` : '',
  ].filter(Boolean).join(' ');

  return {
    post_id: postId,
    url,
    title: course.name,
    description: description || `Course from ${course.institution || 'top institution'}`,
    language: 'English',
    price: 'Free',
    type: 'Course',
    submitted_by: 'QuantSun',
    votes: Math.floor(Math.random() * 40) + 5, // seed with some initial votes
  };
}

async function seed() {
  console.log('🌱 Starting QuantSun database seed...\n');

  // Fetch courses from GitHub
  console.log('📥 Fetching courses from GitHub...');
  const coursesRes = await fetch('https://raw.githubusercontent.com/S1tanshu/QuantSun-data/main/courses.json');
  if (!coursesRes.ok) throw new Error(`Failed to fetch courses: ${coursesRes.status}`);
  const courses = await coursesRes.json();
  console.log(`   ✓ Fetched ${courses.length} courses\n`);

  // Check for existing seed posts and delete them (for re-runs)
  console.log('🗑️  Clearing existing seed data...');
  const seedPostIds = Object.values(SUBJECT_POSTS).map(p => p.id);
  const { error: delErr } = await supabase.from('posts').delete().in('id', seedPostIds);
  if (delErr) console.log('   (No existing seed posts to clear)');
  else console.log('   ✓ Cleared existing seed posts\n');

  // Insert posts
  console.log('📝 Creating subject posts...');
  for (const [subjectKey, postData] of Object.entries(SUBJECT_POSTS)) {
    const { error } = await supabase.from('posts').insert({
      id: postData.id,
      title: postData.title,
      description: postData.description,
      subject: postData.subject,
      topics: postData.topics,
      author_name: postData.authorName,
      author_id: null,
    });
    if (error) {
      console.error(`   ✗ Failed to create post for ${subjectKey}:`, error.message);
    } else {
      console.log(`   ✓ Created post: ${postData.subject}`);
    }
  }
  console.log();

  // Subject key → post ID mapping
  const subjectToPostId = {
    'Comp Sci': SUBJECT_POSTS['Comp Sci'].id,
    'Machine Learning': SUBJECT_POSTS['Machine Learning'].id,
    'Programming': SUBJECT_POSTS['Programming'].id,
    'Mathematics': SUBJECT_POSTS['Mathematics'].id,
    'Finance & Economics': SUBJECT_POSTS['Finance & Economics'].id,
  };

  // Insert resources (courses) in batches
  console.log('📚 Inserting courses as resources...');
  const resources = courses
    .filter(c => subjectToPostId[c.subject])
    .filter(c => c.playlistUrl || c.link)
    .map(c => courseToResource(c, subjectToPostId[c.subject]));

  const BATCH_SIZE = 20;
  let inserted = 0;
  for (let i = 0; i < resources.length; i += BATCH_SIZE) {
    const batch = resources.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('resources').insert(batch);
    if (error) {
      console.error(`   ✗ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`   ✓ Inserted ${inserted}/${resources.length} resources\r`);
    }
  }
  console.log(`\n   ✓ Done inserting ${inserted} course resources\n`);

  // Summary
  console.log('✅ Seed complete!\n');
  console.log('Summary:');
  for (const [subjectKey, postData] of Object.entries(SUBJECT_POSTS)) {
    const count = courses.filter(c => c.subject === subjectKey && (c.playlistUrl || c.link)).length;
    console.log(`   ${postData.subject}: ${count} resources`);
  }
  console.log('\nYou can now run: npm run dev');
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
