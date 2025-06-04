// Utility functions for calculating loop metrics

export interface LoopMetrics {
  estimatedDuration: string;
  recommendedTransport: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
}

interface Place {
  id?: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  mapUrl: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  order?: number;
}

/**
 * Calculate estimated duration based on number of places and their categories
 */
export function calculateLoopMetrics(places: Place[]): LoopMetrics {
  if (places.length === 0) {
    return {
      estimatedDuration: "0h",
      recommendedTransport: "Walking",
      difficulty: "Easy",
    };
  }

  // Base time calculations
  let totalMinutes = 0;

  // Time per place based on category
  const timeByCategory: Record<string, number> = {
    Museum: 90,
    Restaurant: 60,
    Cafe: 30,
    Park: 45,
    Shopping: 45,
    Attraction: 60,
    Landmark: 20,
    Gallery: 45,
    Market: 30,
    Viewpoint: 15,
    default: 30,
  };

  // Calculate time for each place
  places.forEach((place) => {
    const categoryTime =
      timeByCategory[place.category] || timeByCategory.default;
    totalMinutes += categoryTime;
  });

  // Add travel time between places (estimated 10 minutes walking between each)
  const travelTime = Math.max(0, (places.length - 1) * 10);
  totalMinutes += travelTime;

  // Format duration
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let estimatedDuration: string;

  if (hours === 0) {
    estimatedDuration = `${minutes}min`;
  } else if (minutes === 0) {
    estimatedDuration = `${hours}h`;
  } else {
    estimatedDuration = `${hours}h ${minutes}min`;
  }

  // Determine recommended transport
  let recommendedTransport: string;
  if (places.length <= 3 && totalMinutes <= 180) {
    recommendedTransport = "Walking";
  } else if (places.length <= 6 && totalMinutes <= 360) {
    recommendedTransport = "Walking / Public Transport";
  } else {
    recommendedTransport = "Public Transport / Car";
  }

  // Determine difficulty
  let difficulty: "Easy" | "Moderate" | "Challenging";
  if (places.length <= 3 && totalMinutes <= 120) {
    difficulty = "Easy";
  } else if (places.length <= 6 && totalMinutes <= 300) {
    difficulty = "Moderate";
  } else {
    difficulty = "Challenging";
  }

  return {
    estimatedDuration,
    recommendedTransport,
    difficulty,
  };
}

/**
 * Get a more precise duration estimate if we had GPS coordinates
 * This would require integration with a mapping service
 */
export function calculatePreciseDuration(
  places: Place[]
): Promise<LoopMetrics> {
  // Future implementation could use Google Maps API or similar
  // to calculate actual walking/driving distances and times
  return Promise.resolve(calculateLoopMetrics(places));
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  if (hours === 0) {
    return `${remainingMinutes}min`;
  }

  return `~${hours}h ${remainingMinutes}min`;
}
