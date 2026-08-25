import 'dotenv/config';
import mongoose from 'mongoose';
import PlacementCompany from '../models/PlacementCompany.js';
import PlacementQuestion from '../models/PlacementQuestion.js';
import { seedPlacementData } from '../lib/seedPlacementData.js';

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Run seed
    await seedPlacementData();

    // 1. FAANG / Top Product: Apple, Netflix, Uber, Salesforce, Oracle, IBM
    await PlacementQuestion.updateMany(
      { category: 'coding' },
      { $addToSet: { companies: { $each: ['apple', 'netflix', 'uber', 'salesforce', 'oracle', 'ibm', 'goldman-sachs', 'jpmorgan'] } } }
    );

    // 2. Fintech & Banking: Goldman Sachs, JPMorgan Chase
    await PlacementQuestion.updateMany(
      {
        $or: [
          { topics: { $in: ['Probability', 'Profit & Loss', 'Dynamic Programming', 'Array', 'Knapsack', 'Two Pointers', 'DBMS', 'SQL', 'Operating Systems'] } },
          { tags: { $in: ['Quant', 'Fintech', 'FinTech'] } }
        ]
      },
      { $addToSet: { companies: { $each: ['goldman-sachs', 'jpmorgan'] } } }
    );

    // 3. Core Systems, OS & Networks: Cisco, Qualcomm, Apple, Netflix, Uber
    await PlacementQuestion.updateMany(
      {
        topics: {
          $in: [
            'Computer Networks',
            'Operating Systems',
            'Bit Manipulation',
            'C Programming',
            'Memory Management',
            'IP Addressing',
            'Subnetting',
            'Protocols',
            'Virtual Memory',
            'Distributed Systems',
            'System Design',
            'Microservices'
          ]
        }
      },
      { $addToSet: { companies: { $each: ['cisco', 'qualcomm', 'apple', 'netflix', 'uber'] } } }
    );

    // 4. Databases, Cloud & Enterprise: Oracle, Salesforce, IBM, Netflix, Goldman Sachs, JPMorgan
    await PlacementQuestion.updateMany(
      {
        topics: {
          $in: [
            'DBMS',
            'SQL',
            'Indexing',
            'B+ Trees',
            'Cloud Computing',
            'Java',
            'OOP',
            'Linux',
            'Microservices',
            'Distributed Systems'
          ]
        }
      },
      { $addToSet: { companies: { $each: ['oracle', 'salesforce', 'ibm', 'netflix', 'goldman-sachs', 'jpmorgan'] } } }
    );

    // 5. Aptitude & Verbal questions mapped to all 10 MNCs
    await PlacementQuestion.updateMany(
      { category: { $in: ['aptitude', 'english'] } },
      {
        $addToSet: {
          companies: {
            $each: [
              'apple',
              'netflix',
              'oracle',
              'goldman-sachs',
              'jpmorgan',
              'cisco',
              'uber',
              'ibm',
              'salesforce',
              'qualcomm'
            ]
          }
        }
      }
    );

    const companies = [
      'google',
      'microsoft',
      'amazon',
      'meta',
      'apple',
      'netflix',
      'oracle',
      'goldman-sachs',
      'jpmorgan',
      'cisco',
      'uber',
      'ibm',
      'salesforce',
      'qualcomm',
      'tcs',
      'infosys',
      'wipro',
      'accenture',
      'deloitte',
      'cognizant',
      'capgemini',
      'adobe'
    ];

    console.log('\n📊 Questions Per Company in MongoDB:');
    for (const slug of companies) {
      const qCount = await PlacementQuestion.countDocuments({ companies: slug });
      const codingCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'coding' });
      const techCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'technical' });
      const aptCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'aptitude' });
      const engCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'english' });
      console.log(
        `✅ ${slug.padEnd(16)}: Total=${String(qCount).padStart(3)} | Coding=${String(codingCount).padStart(2)} | Tech=${String(techCount).padStart(2)} | Aptitude=${String(aptCount).padStart(2)} | English=${String(engCount).padStart(2)}`
      );
    }

    const total = await PlacementQuestion.countDocuments();
    console.log(`\n🎯 Total Placement Questions in MongoDB: ${total}`);
  } catch (err) {
    console.error('Error running seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main();
