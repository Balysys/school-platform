import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  try {
    await prisma.note.deleteMany();
    await prisma.eleve.deleteMany();
    await prisma.utilisateur.deleteMany();
    await prisma.classe.deleteMany();
    await prisma.matiere.deleteMany();
    await prisma.periode.deleteMany();
  } catch (e) {
    console.log('No existing data to clean');
  }

  // Create classes
  const classe6eA = await prisma.classe.create({
    data: { nom: '6eA', niveau: '6e' }
  });
  const classe6eB = await prisma.classe.create({
    data: { nom: '6eB', niveau: '6e' }
  });
  const classe5eA = await prisma.classe.create({
    data: { nom: '5eA', niveau: '5e' }
  });

  console.log('✅ 3 classes créées');

  // Create subjects
  const maths = await prisma.matiere.create({
    data: { nom: 'Mathématiques', coeff: 3 }
  });
  const francais = await prisma.matiere.create({
    data: { nom: 'Français', coeff: 3 }
  });
  const histoire = await prisma.matiere.create({
    data: { nom: 'Histoire-Géo', coeff: 2 }
  });
  const svt = await prisma.matiere.create({
    data: { nom: 'SVT', coeff: 2 }
  });
  const sport = await prisma.matiere.create({
    data: { nom: 'Sport', coeff: 1 }
  });

  console.log('✅ 5 matières créées');

  // Create periods
  const t1 = await prisma.periode.create({
    data: {
      libelle: 'Trimestre 1',
      dateDebut: new Date('2025-09-01'),
      dateFin: new Date('2025-11-30')
    }
  });
  const t2 = await prisma.periode.create({
    data: {
      libelle: 'Trimestre 2',
      dateDebut: new Date('2025-12-01'),
      dateFin: new Date('2026-02-28')
    }
  });
  const t3 = await prisma.periode.create({
    data: {
      libelle: 'Trimestre 3',
      dateDebut: new Date('2026-03-01'),
      dateFin: new Date('2026-05-31')
    }
  });

  console.log('✅ 3 périodes créées');

  // Create users
  const admin = await prisma.utilisateur.create({
    data: {
      nom: 'Admin',
      email: 'admin@ecole.com',
      mot_de_passe: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    }
  });

  const enseignant = await prisma.utilisateur.create({
    data: {
      nom: 'Martin',
      email: 'prof@ecole.com',
      mot_de_passe: await bcrypt.hash('prof123', 10),
      role: 'ENSEIGNANT'
    }
  });

  const parent = await prisma.utilisateur.create({
    data: {
      nom: 'Diop',
      email: 'parent@example.com',
      mot_de_passe: await bcrypt.hash('parent123', 10),
      role: 'PARENT'
    }
  });

  console.log('✅ 3 utilisateurs créés');

  // Create students
  const students = [];
  const studentData = [
    { prenom: 'Fatou', nom: 'Diop', classe: classe6eA.id },
    { prenom: 'Adama', nom: 'Ba', classe: classe6eA.id },
    { prenom: 'Mariam', nom: 'Ndiaye', classe: classe6eA.id },
    { prenom: 'Aminata', nom: 'Sarr', classe: classe6eA.id },
    { prenom: 'Cheick', nom: 'Cisse', classe: classe6eB.id },
    { prenom: 'Aïssatou', nom: 'Sall', classe: classe6eB.id },
    { prenom: 'Ibrahim', nom: 'Gueye', classe: classe6eB.id },
    { prenom: 'Ndeye', nom: 'Fall', classe: classe6eB.id },
    { prenom: 'Moussa', nom: 'Diouf', classe: classe5eA.id },
    { prenom: 'Awa', nom: 'Thiam', classe: classe5eA.id },
    { prenom: 'Daouda', nom: 'Kane', classe: classe5eA.id },
    { prenom: 'Fatoumata', nom: 'Camara', classe: classe5eA.id }
  ];

  for (const data of studentData) {
    const student = await prisma.eleve.create({
      data: {
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: new Date(`2011-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
        classeId: data.classe,
        parentId: parent.id
      }
    });
    students.push(student);
  }

  console.log('✅ 12 élèves créés');

  // Create notes
  const subjects = [maths, francais, histoire, svt, sport];
  const periods = [t1, t2, t3];

  let notesCount = 0;
  for (const student of students) {
    for (const period of periods) {
      for (const subject of subjects) {
        const note = 10 + Math.random() * 10; // Random between 10 and 20
        await prisma.note.create({
          data: {
            eleveId: student.id,
            matiereId: subject.id,
            periodeId: period.id,
            enseignantId: enseignant.id,
            valeur: Math.round(note * 2) / 2 // Round to 0.5
          }
        });
        notesCount++;
      }
    }
  }

  console.log(`✅ ${notesCount} notes créées`);
  console.log('✅ Test data created!');
  console.log('\n📝 Test Accounts:');
  console.log('Admin:    admin@ecole.com / admin123');
  console.log('Teacher:  prof@ecole.com / prof123');
  console.log('Parent:   parent@example.com / parent123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
