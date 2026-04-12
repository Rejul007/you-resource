import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.comment.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.post.deleteMany();

  // Post 1: Calculus
  const post1 = await prisma.post.create({
    data: {
      title: 'Resources for learning Calculus from scratch',
      description:
        'I am a high school student trying to learn calculus on my own. I need resources that cover limits, derivatives, integrals, and their applications. Video lectures and practice problems would be ideal.',
      subject: 'Mathematics',
      topics: JSON.stringify(['Limits', 'Derivatives', 'Integrals', 'Differential Equations', 'Applications of Calculus']),
      authorName: 'alex_student',
      resources: {
        create: [
          {
            url: 'https://www.khanacademy.org/math/calculus-1',
            title: 'Khan Academy Calculus 1',
            description: 'Free, comprehensive video lessons covering all calculus 1 topics with practice exercises.',
            language: 'English',
            price: 'Free',
            type: 'Course',
            submittedBy: 'sarah_tutor',
            votes: 12,
          },
          {
            url: 'https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/',
            title: 'MIT OpenCourseWare: Single Variable Calculus',
            description: 'MIT lecture notes, problem sets, and exams for single variable calculus.',
            language: 'English',
            price: 'Free',
            type: 'Course',
            submittedBy: 'priya_math',
            votes: 8,
          },
        ],
      },
      comments: {
        create: [
          {
            content: 'Khan Academy is perfect for beginners. Start there!',
            authorName: 'math_helper',
          },
          {
            content: 'Also check out Professor Leonard on YouTube — his calculus series is amazing.',
            authorName: 'calc_fan',
          },
        ],
      },
    },
  });

  // Post 2: Machine Learning
  const post2 = await prisma.post.create({
    data: {
      title: 'Best resources to learn Machine Learning in 2024',
      description:
        'I have a background in Python and basic statistics. Looking for resources to get into machine learning — from linear regression all the way to neural networks. Preferably free or affordable courses.',
      subject: 'Computer Science',
      topics: JSON.stringify(['Machine Learning', 'Neural Networks', 'Linear Regression', 'Python', 'Deep Learning', 'Statistics']),
      authorName: 'dev_curious',
      resources: {
        create: [
          {
            url: 'https://www.coursera.org/specializations/machine-learning-introduction',
            title: 'Machine Learning Specialization - Andrew Ng',
            description: 'The classic ML course by Andrew Ng, updated for 2022 with modern techniques.',
            language: 'English',
            price: 'Freemium',
            type: 'Course',
            submittedBy: 'ml_enthusiast',
            votes: 24,
          },
          {
            url: 'https://arxiv.org/abs/1511.07122',
            title: 'Deep Learning Book (Goodfellow et al.)',
            description: 'The comprehensive deep learning textbook by Goodfellow, Bengio, and Courville.',
            language: 'English',
            price: 'Free',
            type: 'Book',
            submittedBy: 'researcher_ai',
            votes: 15,
          },
        ],
      },
      comments: {
        create: [
          {
            content: 'Andrew Ng course is the gold standard. Highly recommend it.',
            authorName: 'senior_dev',
          },
        ],
      },
    },
  });

  // Post 3: Organic Chemistry
  const post3 = await prisma.post.create({
    data: {
      title: 'Help with Organic Chemistry mechanisms',
      description:
        'Struggling with understanding reaction mechanisms in organic chemistry. Need resources that explain nucleophilic substitution, elimination reactions, and aromatic chemistry clearly.',
      subject: 'Chemistry',
      topics: JSON.stringify(['Organic Chemistry', 'Reaction Mechanisms', 'Nucleophilic Substitution', 'Elimination Reactions', 'Aromatic Chemistry']),
      authorName: 'chem_student_22',
      resources: {
        create: [
          {
            url: 'https://www.khanacademy.org/science/organic-chemistry',
            title: 'Khan Academy Organic Chemistry',
            description: 'Free video lessons covering all major organic chemistry topics with visual explanations.',
            language: 'English',
            price: 'Free',
            type: 'Video',
            submittedBy: 'orgo_helper',
            votes: 9,
          },
        ],
      },
    },
  });

  // Post 4: World War II History
  const post4 = await prisma.post.create({
    data: {
      title: 'Comprehensive resources on World War II',
      description:
        'Looking for detailed resources about World War II — causes, major battles, the Holocaust, and the aftermath. Need both primary sources and modern historical analysis.',
      subject: 'History',
      topics: JSON.stringify(['World War II', 'Holocaust', 'Cold War Origins', 'D-Day', 'Pacific Theater', 'Post-War Reconstruction']),
      authorName: 'history_buff',
      resources: {
        create: [
          {
            url: 'https://www.history.com/topics/world-war-ii',
            title: 'History.com WWII Collection',
            description: 'Articles, photos, and videos covering major events and figures of World War II.',
            language: 'English',
            price: 'Free',
            type: 'Article',
            submittedBy: 'ww2_scholar',
            votes: 6,
          },
        ],
      },
    },
  });

  console.log('Seed data created successfully!');
  console.log(`Created posts: ${post1.id}, ${post2.id}, ${post3.id}, ${post4.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
