import fs from 'fs';
import path from 'path';

const findings = [];

// Scan specific component files
const filesToScan = [
  'src/components/Button/Button.tsx',
  'src/components/Card/Card.tsx',
  'src/components/DraggableHabit/DraggableHabit.tsx',
  'src/components/HabitCard/HabitCard.tsx',
  'src/components/CreateHabitModal/CreateHabitModalCentered.tsx',
  'src/components/ProgressSection/ProgressSection.tsx',
  'src/components/Modal/Modal.tsx',
];

filesToScan.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    console.log(`\n=== ${file} ===`);
    console.log(content.substring(0, 500));
  }
});
