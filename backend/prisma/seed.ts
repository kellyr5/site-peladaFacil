import { PrismaClient, Sport, Position, MatchType, RequestUrgency } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Brazilian cities with coordinates
const brazilianCities = [
  { city: 'São Paulo', state: 'SP', lat: -23.5505, lng: -46.6333 },
  { city: 'Rio de Janeiro', state: 'RJ', lat: -22.9068, lng: -43.1729 },
  { city: 'Belo Horizonte', state: 'MG', lat: -19.9167, lng: -43.9345 },
  { city: 'Porto Alegre', state: 'RS', lat: -30.0346, lng: -51.2177 },
  { city: 'Curitiba', state: 'PR', lat: -25.4284, lng: -49.2733 },
  { city: 'Brasília', state: 'DF', lat: -15.8267, lng: -47.9218 },
  { city: 'Salvador', state: 'BA', lat: -12.9714, lng: -38.5014 },
  { city: 'Fortaleza', state: 'CE', lat: -3.7172, lng: -38.5434 },
  { city: 'Recife', state: 'PE', lat: -8.0476, lng: -34.8770 },
  { city: 'Florianópolis', state: 'SC', lat: -27.5954, lng: -48.5480 },
];

const maleNames = [
  'João Silva', 'Pedro Santos', 'Carlos Oliveira', 'Lucas Souza', 'Rafael Costa',
  'Bruno Lima', 'Gustavo Pereira', 'Fernando Rodrigues', 'Thiago Alves', 'Marcelo Ferreira',
  'André Martins', 'Paulo Carvalho', 'Diego Ribeiro', 'Felipe Barbosa', 'Ricardo Araújo',
  'Matheus Cardoso', 'Gabriel Nascimento', 'Vinícius Dias', 'Leonardo Castro', 'Rodrigo Gomes',
];

const femaleNames = [
  'Maria Silva', 'Ana Santos', 'Juliana Oliveira', 'Fernanda Souza', 'Camila Costa',
  'Beatriz Lima', 'Larissa Pereira', 'Patricia Rodrigues', 'Amanda Alves', 'Carla Ferreira',
  'Renata Martins', 'Tatiana Carvalho', 'Vanessa Ribeiro', 'Gabriela Barbosa', 'Cristina Araújo',
];

const avatarUrls = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
];

const matchLocations = [
  { name: 'Arena Sports Center', address: 'Av. Paulista, 1000' },
  { name: 'Complexo Esportivo Vila Olímpica', address: 'Rua das Flores, 500' },
  { name: 'Quadra do Parque Central', address: 'Parque Municipal, s/n' },
  { name: 'Ginásio Poliesportivo', address: 'Av. Principal, 2000' },
  { name: 'Society Beira-Rio', address: 'Marginal do Rio, 300' },
  { name: 'Clube Atlético', address: 'Rua dos Esportes, 750' },
];

const achievements = [
  {
    name: 'Primeiro Gol',
    description: 'Marque seu primeiro gol',
    icon: '⚽',
    type: 'goals',
    requirement: { value: 1 },
  },
  {
    name: 'Artilheiro Iniciante',
    description: 'Marque 10 gols',
    icon: '🎯',
    type: 'goals',
    requirement: { value: 10 },
  },
  {
    name: 'Artilheiro Experiente',
    description: 'Marque 50 gols',
    icon: '🔥',
    type: 'goals',
    requirement: { value: 50 },
  },
  {
    name: 'Craque',
    description: 'Marque 100 gols',
    icon: '⭐',
    type: 'goals',
    requirement: { value: 100 },
  },
  {
    name: 'Primeira Partida',
    description: 'Jogue sua primeira partida',
    icon: '🏃',
    type: 'matches',
    requirement: { value: 1 },
  },
  {
    name: 'Jogador Ativo',
    description: 'Jogue 20 partidas',
    icon: '💪',
    type: 'matches',
    requirement: { value: 20 },
  },
  {
    name: 'Veterano',
    description: 'Jogue 100 partidas',
    icon: '🏆',
    type: 'matches',
    requirement: { value: 100 },
  },
  {
    name: 'Primeira Vitória',
    description: 'Vença sua primeira partida',
    icon: '🥇',
    type: 'wins',
    requirement: { value: 1 },
  },
  {
    name: 'Vencedor',
    description: 'Vença 10 partidas',
    icon: '🏅',
    type: 'wins',
    requirement: { value: 10 },
  },
  {
    name: 'Campeão',
    description: 'Vença 50 partidas',
    icon: '👑',
    type: 'wins',
    requirement: { value: 50 },
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create achievements
  console.log('Creating achievements...');
  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    });
  }

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@peladafacil.com',
      password: adminPassword,
      name: 'Admin Pelada Fácil',
      avatar: avatarUrls[0],
      role: 'ADMIN',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5505,
      longitude: -46.6333,
      bio: 'Administrador da plataforma Pelada Fácil',
      level: 50,
      xp: 10000,
      rating: 5.0,
      totalRatings: 100,
    },
  });

  // Create regular users
  console.log('Creating users...');
  const users = [];
  const hashedPassword = await bcrypt.hash('senha123', 10);

  for (let i = 0; i < 50; i++) {
    const city = brazilianCities[i % brazilianCities.length];
    const name = i < 30 ? maleNames[i % maleNames.length] : femaleNames[i % femaleNames.length];
    const latOffset = (Math.random() - 0.5) * 0.2; // ±0.1 degree
    const lngOffset = (Math.random() - 0.5) * 0.2;

    const sports = [Sport.FOOTBALL, Sport.FUTSAL, Sport.VOLLEYBALL, Sport.BASKETBALL];
    const selectedSports = sports.filter(() => Math.random() > 0.5);

    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@email.com`,
        password: hashedPassword,
        name,
        avatar: avatarUrls[i % avatarUrls.length],
        phone: `11${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        city: city.city,
        state: city.state,
        latitude: city.lat + latOffset,
        longitude: city.lng + lngOffset,
        bio: `Apaixonado por esportes e sempre pronto para uma boa partida!`,
        preferredSports: selectedSports.length > 0 ? selectedSports : [Sport.FOOTBALL],
        preferredPositions: [Position.FORWARD, Position.MIDFIELDER],
        level: Math.floor(Math.random() * 50) + 1,
        xp: Math.floor(Math.random() * 5000),
        rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
        totalRatings: Math.floor(Math.random() * 50) + 1,
        isAvailable: Math.random() > 0.5,
      },
    });

    users.push(user);

    // Create stats for each sport
    for (const sport of [Sport.FOOTBALL, Sport.FUTSAL]) {
      await prisma.playerStats.create({
        data: {
          userId: user.id,
          sport,
          matchesPlayed: Math.floor(Math.random() * 100),
          wins: Math.floor(Math.random() * 50),
          draws: Math.floor(Math.random() * 30),
          losses: Math.floor(Math.random() * 20),
          goals: Math.floor(Math.random() * 80),
          assists: Math.floor(Math.random() * 50),
          yellowCards: Math.floor(Math.random() * 10),
          redCards: Math.floor(Math.random() * 3),
          mvpCount: Math.floor(Math.random() * 10),
        },
      });
    }
  }

  console.log('Creating matches...');
  const matches = [];
  for (let i = 0; i < 30; i++) {
    const organizer = users[Math.floor(Math.random() * users.length)];
    const city = brazilianCities[i % brazilianCities.length];
    const location = matchLocations[i % matchLocations.length];
    const daysOffset = Math.floor(Math.random() * 30) - 10; // -10 to +20 days
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);

    const match = await prisma.match.create({
      data: {
        type: Math.random() > 0.3 ? MatchType.CASUAL : MatchType.CHAMPIONSHIP,
        sport: [Sport.FOOTBALL, Sport.FUTSAL, Sport.VOLLEYBALL][Math.floor(Math.random() * 3)],
        name: `Pelada ${location.name}`,
        description: 'Partida amadora para se divertir e fazer network!',
        date,
        locationName: location.name,
        address: `${location.address}, ${city.city} - ${city.state}`,
        latitude: city.lat + (Math.random() - 0.5) * 0.1,
        longitude: city.lng + (Math.random() - 0.5) * 0.1,
        organizerId: organizer.id,
        maxPlayers: Math.random() > 0.5 ? 10 : 14,
        currentPlayers: 0,
        cost: Math.floor(Math.random() * 50) + 10,
        status: daysOffset < 0 ? 'FINISHED' : (Math.random() > 0.5 ? 'OPEN' : 'FULL'),
      },
    });

    matches.push(match);

    // Add players to match
    const numPlayers = Math.min(
      match.maxPlayers,
      Math.floor(Math.random() * match.maxPlayers) + 3
    );

    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    for (let j = 0; j < numPlayers; j++) {
      await prisma.matchPlayer.create({
        data: {
          matchId: match.id,
          userId: shuffledUsers[j].id,
          checkedIn: Math.random() > 0.2,
          hasPaid: Math.random() > 0.3,
          goals: match.status === 'FINISHED' ? Math.floor(Math.random() * 4) : 0,
          assists: match.status === 'FINISHED' ? Math.floor(Math.random() * 3) : 0,
          yellowCards: match.status === 'FINISHED' ? (Math.random() > 0.8 ? 1 : 0) : 0,
          isMVP: match.status === 'FINISHED' && j === 0,
        },
      });
    }

    // Update match current players
    await prisma.match.update({
      where: { id: match.id },
      data: { currentPlayers: numPlayers },
    });
  }

  // Create market requests
  console.log('Creating market requests...');
  for (let i = 0; i < 15; i++) {
    const match = matches.filter(m => m.status === 'OPEN')[i % 10];
    if (!match) continue;

    await prisma.marketRequest.create({
      data: {
        matchId: match.id,
        requesterId: match.organizerId,
        sport: match.sport,
        position: [Position.FORWARD, Position.MIDFIELDER, Position.DEFENDER][Math.floor(Math.random() * 3)],
        urgency: [RequestUrgency.LOW, RequestUrgency.MEDIUM, RequestUrgency.HIGH][Math.floor(Math.random() * 3)],
        latitude: match.latitude,
        longitude: match.longitude,
        radius: Math.floor(Math.random() * 20) + 5,
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`
📊 Created:
  - 1 Admin user (admin@peladafacil.com / admin123)
  - 50 Regular users (user1@email.com to user50@email.com / senha123)
  - ${matches.length} Matches
  - 15 Market requests
  - ${achievements.length} Achievements
  - 100 Player stats records
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
