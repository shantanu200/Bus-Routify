
import { IBus } from "./Bus";

export interface IPoints {
  id?: number;
  cityId?: number;
  time?: string;
  location: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt?: string;
}
export interface ICity {
  id: number;
  city: ICityGlobal;
  createdAt: string;
  OperatorCityPoints: IPoints[];
  busBoardingCity: IBus[];
  busDroppingCity: IBus[];
  _count?: {
    busBoardingCity: number;
    busDroppingCity: number;
    OperatorCityPoints: number;
  };
}

export interface ILocation {
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ICityGlobal {
  id: number;
  name: string;
}
