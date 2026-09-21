import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

let genAI: GoogleGenerativeAI | null = null;

if (env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  } catch (e) {
    console.warn('Gemini SDK setup notice:', e);
  }
}

export interface RecommendationParams {
  interests: string[];
  durationDays?: number;
  startingCity?: string;
  travelerType?: string;
}

export async function generateBiharTravelRecommendation(params: RecommendationParams) {
  const systemPrompt = `You are the SETU AI Travel Companion, an expert concierge specializing in Bihar luxury & heritage tourism.
Your role is to craft inspiring, authentic Bihar travel itineraries covering Buddhist Circuit, Ramayan Circuit, Eco-tourism, Mithila arts, and regional cuisine like Litti Chokha and Makhana.
Always return structured JSON matching this exact format:
{
  "title": "Short descriptive title for the recommended trip",
  "summary": "2-3 sentence engaging editorial summary",
  "suggestedDuration": "e.g. 3 Days / 2 Nights",
  "recommendedCircuits": ["Circuit names"],
  "highlightDestinations": ["Destination names"],
  "dayByDayItinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["Activity 1", "Activity 2"],
      "recommendedFood": "Local culinary highlight"
    }
  ],
  "insiderTips": ["Tip 1", "Tip 2"]
}`;

  const userPrompt = `Generate a personalized Bihar travel recommendation for:
Interests: ${params.interests.join(', ') || 'Heritage, Culture & Food'}
Duration: ${params.durationDays || 3} Days
Starting Location: ${params.startingCity || 'Patna'}
Traveler Type: ${params.travelerType || 'Solo/Family traveler'}`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
      const text = response.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Gemini API call fallback to intelligent preset:', err);
    }
  }

  // Fallback Bihar Travel Expert Curator Response
  return {
    title: `Sacred Heritage & Cultural Splendors of Bihar (${params.durationDays || 3} Days)`,
    summary: `An curated editorial journey through Bihar's most iconic spiritual sanctuaries, UNESCO heritage sites, and traditional Mithila art hubs starting from ${params.startingCity || 'Patna'}.`,
    suggestedDuration: `${params.durationDays || 3} Days`,
    recommendedCircuits: ['Buddhist Circuit', 'Mithila Cultural Trail'],
    highlightDestinations: ['Mahabodhi Temple Complex', 'Nalanda Mahavihara Ruins', 'Rajgir Peace Pagoda', 'Takht Sri Patna Sahib'],
    dayByDayItinerary: [
      {
        day: 1,
        title: 'Arrival in Patna & Sacred Heritage',
        activities: [
          'Visit Takht Sri Harmandir Sahib, birthplace of Guru Gobind Singh Ji.',
          'Explore Bihar Museum and sunset stroll along Ganges Marine Drive.'
        ],
        recommendedFood: 'Authentic Bihari Litti Chokha with ghee & baingan bharta at Patna Sahib'
      },
      {
        day: 2,
        title: 'Ancient Wisdom of Nalanda & Rajgir Hills',
        activities: [
          'Excursion to UNESCO World Heritage Nalanda University Ruins.',
          'Ropeway ride to Vishwa Shanti Stupa and Vulture Peak in Rajgir.'
        ],
        recommendedFood: 'Fresh Makhana Kheer and Khaja from Silao'
      },
      {
        day: 3,
        title: 'Enlightenment Sanctuary in Bodh Gaya',
        activities: [
          'Morning meditation under the sacred Bodhi Tree at Mahabodhi Temple.',
          'Tour of Great Buddha 80ft statue and International Monasteries.'
        ],
        recommendedFood: 'Traditional Sujata Kheer & Herbal Herbal Teas'
      }
    ],
    insiderTips: [
      'Attend evening chanting at Mahabodhi Temple around 6:00 PM for deep spiritual immersion.',
      'Purchase certified Madhubani paintings directly from artisan villages in Mithila.'
    ]
  };
}
