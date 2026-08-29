import 'dotenv/config';
import mongoose from 'mongoose';
import PlacementCompany from '../models/PlacementCompany.js';
import PlacementQuestion from '../models/PlacementQuestion.js';
import { seedPlacementData, COMPANIES_DATA } from '../lib/seedPlacementData.js';

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Run clean placement data seed
    await seedPlacementData();

    const companies = COMPANIES_DATA.map((c) => c.slug);

    console.log('\n📊 Questions Per Company Track in MongoDB:');
    for (const slug of companies) {
      const qCount = await PlacementQuestion.countDocuments({ companies: slug });
      const codingCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'coding' });
      const techCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'technical' });
      const aptCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'aptitude' });
      const engCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'english' });
      const interviewCount = await PlacementQuestion.countDocuments({ companies: slug, category: 'interview' });
      console.log(
        `✅ ${slug.padEnd(16)}: Total=${String(qCount).padStart(3)} | Coding=${String(codingCount).padStart(2)} | Tech=${String(techCount).padStart(2)} | Aptitude=${String(aptCount).padStart(2)} | English=${String(engCount).padStart(2)} | Interview=${String(interviewCount).padStart(2)}`
      );
    }

    const total = await PlacementQuestion.countDocuments();
    console.log(`\n🎯 Total Unique Placement Questions in MongoDB: ${total}`);
  } catch (err) {
    console.error('❌ Error running seed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main();
