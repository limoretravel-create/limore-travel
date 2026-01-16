import { Database } from '../lib/supabase';

type PackageRow = Database['public']['Tables']['packages']['Row'];
type CarRow = Database['public']['Tables']['cars']['Row'];

// Adapter functions to convert database types to component types

export interface Package {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  image: string;
  description: string;
  maxTravelers: number;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  pricePerDay: number;
  image: string;
  fuelType: string;
  seats: number;
  transmission: string;
  features: string[];
}

export const adaptPackage = (dbPackage: PackageRow): Package => ({
  id: dbPackage.id,
  title: dbPackage.title,
  destination: dbPackage.destination,
  duration: dbPackage.duration,
  price: dbPackage.price,
  image: dbPackage.image_url,
  description: dbPackage.description,
  maxTravelers: dbPackage.max_travelers,
});

export const adaptCar = (dbCar: CarRow): Car => ({
  id: dbCar.id,
  name: dbCar.name,
  brand: dbCar.brand,
  model: dbCar.model,
  pricePerDay: dbCar.price_per_day,
  image: dbCar.image_url,
  fuelType: dbCar.fuel_type,
  seats: dbCar.seats,
  transmission: dbCar.transmission,
  features: dbCar.features,
});

export const toPackageInsert = (pkg: Partial<Package>): Database['public']['Tables']['packages']['Insert'] => ({
  title: pkg.title || '',
  destination: pkg.destination || '',
  duration: pkg.duration || '',
  price: pkg.price || 0,
  image_url: pkg.image || '',
  description: pkg.description || '',
  max_travelers: pkg.maxTravelers || 1,
  status: 'draft',
});

export const toCarInsert = (car: Partial<Car>): Database['public']['Tables']['cars']['Insert'] => ({
  name: car.name || '',
  brand: car.brand || '',
  model: car.model || '',
  price_per_day: car.pricePerDay || 0,
  image_url: car.image || '',
  fuel_type: car.fuelType || '',
  seats: car.seats || 5,
  transmission: car.transmission || 'Auto',
  features: car.features || [],
  status: 'draft',
});

