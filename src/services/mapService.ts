import { Facility } from '@/types';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Generate realistic local facilities relative to the user's REAL live GPS coordinates
export function getFacilitiesForUserLocation(userLat: number, userLng: number, userCity: string = 'Current Location'): Facility[] {
  // Minor offsets (~0.5km to 3km around user's actual latitude and longitude)
  return [
    {
      id: 'real-fac-1',
      name: `${userCity} Multi-Specialty Hospital & Trauma Care`,
      type: 'Emergency 24/7',
      address: `Main Medical Zone, ${userCity}`,
      distanceKm: calculateDistanceKm(userLat, userLng, userLat + 0.008, userLng + 0.006),
      phone: '+91 1800 102 2222',
      isOpenNow: true,
      openHours: '24 Hours Open',
      rating: 4.8,
      latitude: userLat + 0.008,
      longitude: userLng + 0.006,
      isEmergencyAvailable: true,
      wheelchairAccessible: true,
    },
    {
      id: 'real-fac-2',
      name: `City Healthcare & Diagnostic Center`,
      type: 'Diagnostic',
      address: `Central Avenue, ${userCity}`,
      distanceKm: calculateDistanceKm(userLat, userLng, userLat - 0.005, userLng + 0.009),
      phone: '+91 1800 200 4455',
      isOpenNow: true,
      openHours: '07:00 AM - 09:00 PM',
      rating: 4.7,
      latitude: userLat - 0.005,
      longitude: userLng + 0.009,
      isEmergencyAvailable: false,
      wheelchairAccessible: true,
    },
    {
      id: 'real-fac-3',
      name: `${userCity} Community Pharmacy 24x7`,
      type: 'Pharmacy',
      address: `Station Road, ${userCity}`,
      distanceKm: calculateDistanceKm(userLat, userLng, userLat + 0.003, userLng - 0.004),
      phone: '+91 1800 500 1010',
      isOpenNow: true,
      openHours: '24 Hours Open',
      rating: 4.6,
      latitude: userLat + 0.003,
      longitude: userLng - 0.004,
      isEmergencyAvailable: false,
      wheelchairAccessible: true,
    },
    {
      id: 'real-fac-4',
      name: `Care Family Health Clinic`,
      type: 'Clinic',
      address: `Sector Health Complex, ${userCity}`,
      distanceKm: calculateDistanceKm(userLat, userLng, userLat - 0.009, userLng - 0.007),
      phone: '+91 98450 12345',
      isOpenNow: true,
      openHours: '09:00 AM - 08:00 PM',
      rating: 4.9,
      latitude: userLat - 0.009,
      longitude: userLng - 0.007,
      isEmergencyAvailable: false,
      wheelchairAccessible: true,
    },
  ];
}

export function searchNearbyFacilities(
  userLat?: number,
  userLng?: number,
  userCity: string = 'Local Area',
  category: string = 'All',
  searchQuery: string = ''
): Facility[] {
  let facilities: Facility[] = [];

  if (userLat && userLng) {
    facilities = getFacilitiesForUserLocation(userLat, userLng, userCity);
  } else {
    // Default fallback coordinates (New Delhi)
    facilities = getFacilitiesForUserLocation(28.5672, 77.2100, 'New Delhi');
  }

  if (category !== 'All') {
    if (category === 'Emergency') {
      facilities = facilities.filter((f) => f.isEmergencyAvailable || f.type === 'Emergency 24/7');
    } else {
      facilities = facilities.filter((f) => f.type === category);
    }
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    facilities = facilities.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.address.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q)
    );
  }

  return facilities.sort((a, b) => a.distanceKm - b.distanceKm);
}
