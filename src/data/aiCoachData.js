export const dailyChallenges = [
  { id: 1, title: 'Walk or cycle for short trips today', points: 20, category: 'Transport', icon: '🚴' },
  { id: 2, title: 'Have a plant-based meal', points: 15, category: 'Food', icon: '🥗' },
  { id: 3, title: 'Turn off all standby electronics', points: 10, category: 'Energy', icon: '💡' },
  { id: 4, title: 'Carry a reusable bag for shopping', points: 10, category: 'Waste', icon: '👜' },
  { id: 5, title: 'Take a 5-minute shorter shower', points: 12, category: 'Water', icon: '🚿' },
]

export const weeklyReport = {
  week: 'June 3–9, 2024',
  totalCO2: 3.2,
  vsLastWeek: -12,
  highlights: [
    'You reduced transportation emissions by 18% this week!',
    'Completed 5 out of 7 daily eco-challenges.',
    'Your food choices saved 4.2 kg CO₂.',
  ],
  improvements: [
    'Home energy usage slightly increased – check for idle devices.',
    'Only 1 recycling activity logged this week.',
  ],
  score: 79,
}

export const mockAIResponses = {
  greetings: [
    "Hi there, Eco Warrior! 🌱 Ready to make today a little greener? I have personalized tips based on your recent activity.",
    "Welcome back, Aryan! 🌍 Your streak is at 14 days — that's amazing! Let's keep the momentum going.",
    "Good to see you! 🌿 Based on your footprint data, I have some high-impact actions for you today.",
  ],
  transportation: [
    "Your transport emissions are 15% above your city average. Switching to public transit just 3 days a week could save ~45 kg CO₂/month. Mumbai's Metro Line 3 now covers your area!",
    "Carpooling with just one colleague twice a week could cut your commute emissions by 40%. Have you tried connecting through the EcoTrack community?",
    "For trips under 3km, walking or cycling is both zero-emission AND free exercise! You have 3 such trips in your history this week.",
  ],
  food: [
    "Your diet is already in the top 20% for sustainability in India! 🎉 Going fully vegetarian on weekdays could save an additional 28 kg CO₂/month.",
    "Local, seasonal produce has 5x lower transport emissions than imported goods. The weekend farmer's market in Bandra is a great start!",
    "Reducing beef consumption by just 1 meal/week saves approximately 3 kg CO₂. Your current food pattern looks good — keep it up!",
  ],
  energy: [
    "Your electricity usage spikes on weekdays between 7–9 PM. Running high-energy appliances during off-peak hours (11 PM–7 AM) cuts grid emissions by up to 30%.",
    "Switching to a green energy plan with Tata Power is available in Mumbai and could make your home energy carbon-neutral!",
    "Your AC usage accounts for 60% of your home electricity bill. Setting it 2°C higher (26°C instead of 24°C) saves ~15% energy.",
  ],
  general: [
    "You're doing great! Your current carbon footprint of 3.8 tonnes/year is well below the India average. Focus on transportation to break into the top 10%!",
    "I've analyzed your patterns for the past 30 days. Your biggest opportunity for reduction is shifting 2 car trips per week to public transit.",
    "Your sustainability score increased 5 points this month! Consistent daily habits are the key — even small actions compound over time.",
  ],
}

export const weeklyRoadmap = [
  { week: 1, theme: 'Transport Reset', actions: ['Map 3 public transport routes you can use', 'Install Citymapper/Rapido for your city', 'Log every commute this week'], targetSaving: 8.4 },
  { week: 2, theme: 'Energy Audit', actions: ['Check all standby devices', 'Switch to LED if not done', 'Read your electricity meter daily'], targetSaving: 5.2 },
  { week: 3, theme: 'Food Footprint', actions: ['Try 5 vegetarian meals', 'Shop at a local market once', 'Reduce food waste by meal planning'], targetSaving: 4.8 },
  { week: 4, theme: 'Zero Waste Week', actions: ['Audit your plastic usage', 'Start a compost bin', 'Refuse single-use items'], targetSaving: 3.6 },
]
