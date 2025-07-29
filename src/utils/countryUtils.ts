import countriesData from '@/config/countries.json';

export interface Country {
  code: string;
  name: string;
  isDefault: boolean;
}

export function getCountryName(code: string): string {
  const country = countriesData.find(c => c.code === code);
  return country ? country.name : code;
}

export function getCountryCode(name: string): string {
  const country = countriesData.find(c => c.name === name);
  return country ? country.code : name;
}

export function getDefaultCountry(): Country {
  return countriesData.find(c => c.isDefault) || countriesData[0];
}

export function getAllCountries(): Country[] {
  return countriesData;
}

export function isValidCountryCode(code: string): boolean {
  return countriesData.some(c => c.code === code);
}