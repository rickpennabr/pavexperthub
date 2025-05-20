export interface LatLng {
  lat(): number;
  lng(): number;
}

export interface LatLngBounds {
  getNorthEast(): LatLng;
  getSouthWest(): LatLng;
}

export interface AutocompleteOptions {
  componentRestrictions?: { country: string };
  fields?: string[];
  types?: string[];
  bounds?: LatLngBounds;
  strictBounds?: boolean;
}

export interface Autocomplete {
  addListener(event: string, callback: () => void): void;
  getPlace(): Place;
}

export interface Place {
  address_components?: AddressComponent[];
  formatted_address?: string;
  geometry?: {
    location: LatLng;
  };
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: AutocompleteOptions
          ) => Autocomplete;
        };
        event: {
          clearInstanceListeners: (instance: unknown) => void;
        };
        LatLng: new (lat: number, lng: number) => LatLng;
        LatLngBounds: new (
          sw: LatLng,
          ne: LatLng
        ) => LatLngBounds;
      };
    };
  }
} 