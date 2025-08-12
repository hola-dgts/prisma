import bcrypt from 'bcryptjs';
import { FileStorage } from '../lib/fileStorage';
import { generateToken } from '../lib/jwt';
import { User } from '../types/auth';
import { Presentation, PresentationContent } from '../types/presentation';

// Types for creating data without auto-generated fields
type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type CreatePresentation = Omit<Presentation, 'id' | 'createdAt' | 'updatedAt'>;

async function main() {
  console.log('🌱 Seeding JSON File Storage...');

  // Initialize storage instances
  const userStorage = new FileStorage<User>('users.json');
  const presentationStorage = new FileStorage<Presentation>('presentations.json');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminData: CreateUser = {
    email: 'admin@prisma.com',
    password: adminPassword,
    name: 'Administrator',
    role: 'ADMIN'
  };
  const admin = await userStorage.create(adminData as User);

  console.log('✅ Admin user created:', admin.email);

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 12);
  const demoData: CreateUser = {
    email: 'demo@prisma.com',
    password: demoPassword,
    name: 'Demo User',
    role: 'USER'
  };
  const demoUser = await userStorage.create(demoData as User);

  console.log('✅ Demo user created:', demoUser.email);

  // Create sample presentation content
  const sampleContent: PresentationContent = {
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        title: 'Transformación Digital',
        content: [
          {
            id: 'content-1',
            type: 'text',
            data: 'Propuesta para Cliente ABC',
            style: {
              fontSize: '24px',
              textAlign: 'center',
              color: '#DC2626'
            }
          }
        ]
      },
      {
        id: 'slide-2',
        type: 'content',
        title: 'Agenda',
        content: [
          {
            id: 'content-2',
            type: 'text',
            data: '1. Análisis actual\n2. Propuesta de solución\n3. Cronograma\n4. Inversión'
          }
        ]
      },
      {
        id: 'slide-3',
        type: 'content',
        title: 'Beneficios Clave',
        content: [
          {
            id: 'content-3',
            type: 'text',
            data: '• Reducción de costos del 30%\n• Mejora en eficiencia\n• Automatización de procesos'
          }
        ]
      }
    ],
    theme: {
      primaryColor: '#DC2626',
      secondaryColor: '#B91C1C',
      backgroundColor: '#FFFFFF',
      textColor: '#262626',
      fontFamily: 'Inter'
    },
    settings: {
      autoPlay: false,
      autoPlayDelay: 5000,
      showNavigation: true,
      showProgress: true,
      allowChat: true,
      allowVoice: true
    }
  };

  // Create sample presentations
  const presentation1Data: Presentation = {
    id: 'pres_1735507200000_abc123',
    title: 'Propuesta Comercial - Cliente ABC',
    description: 'Presentación para proyecto de transformación digital',
    content: sampleContent,
    status: 'PUBLISHED',
    accessToken: 'abc123def456',
    authorId: admin.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const presentation1 = await presentationStorage.create(presentation1Data);

  console.log('✅ Presentation 1 created:', presentation1.title);

  const presentation2Content: PresentationContent = {
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        title: 'Plataforma Cloud',
        content: [
          {
            id: 'content-1',
            type: 'text',
            data: 'Demostración Técnica',
            style: {
              fontSize: '24px',
              textAlign: 'center',
              color: '#DC2626'
            }
          }
        ]
      },
      {
        id: 'slide-2',
        type: 'content',
        title: 'Arquitectura',
        content: [
          {
            id: 'content-2',
            type: 'text',
            data: 'Descripción de la arquitectura cloud propuesta'
          }
        ]
      }
    ],
    theme: {
      primaryColor: '#DC2626',
      secondaryColor: '#B91C1C',
      backgroundColor: '#FFFFFF',
      textColor: '#262626',
      fontFamily: 'Inter'
    },
    settings: {
      autoPlay: true,
      autoPlayDelay: 3000,
      showNavigation: true,
      showProgress: true,
      allowChat: true,
      allowVoice: false
    }
  };

  const presentation2Data: Presentation = {
    id: 'pres_1735507300000_def456',
    title: 'Demo Técnico - Plataforma Cloud',
    description: 'Demostración técnica de capacidades cloud',
    content: presentation2Content,
    status: 'DRAFT',
    authorId: admin.id,
    accessToken: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const presentation2 = await presentationStorage.create(presentation2Data);

  console.log('✅ Presentation 2 created:', presentation2.title);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: 2 (1 admin, 1 demo)`);
  console.log(`📋 Presentations: 2 (1 published, 1 draft)`);
  console.log('\n🔐 Test accounts:');
  console.log('Admin: admin@prisma.com / admin123');
  console.log('Demo: demo@prisma.com / demo123');
  console.log('\n🌐 Access tokens:');
  console.log('Presentation 1: abc123def456');
  console.log('\n💾 Data stored in JSON files:');
  console.log('- src/data/users.json');
  console.log('- src/data/presentations.json');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
