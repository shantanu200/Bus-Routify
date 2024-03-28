import { ICity } from "./Location";

export interface IBus {
  id: number;
  name: string;
  number: string;
  operatorId: number;
  boardingCityId: number;
  droppingCityId: number;
  droppingCity: ICity;
  boardingCity: ICity;
  createdAt: string;
  busSchedule: ISchedule[];
}

export interface ISchedule {
  id: number;
  busId: number;
  bus: IBus;
  date: string;
  time: string;
  passenger: IPassenger[];
  _count?: {
    passenger: number;
  };
  createdAt: string;
}

export interface IPassenger {
  id: number;
  name: string;
  email: string;
  contact: string;
  seat: string;
  boardingPoint: {
    location: string;
    address: string;
  };
  BusSchedule: {
    time: string;
    bus: {
      boardingCity: {
        city: {
          name: string;
        };
      };
      droppingCity: {
        city: {
          name: string;
        };
      };
    };
  };
  boardingPointId: number;
  createdAt: string;
  busScheduleId: number;
  date: string;
  paidAmount: number;
  status: string;
  userId: number;
}

export interface IPassengerBooking {
  id: number;
  name: string;
  number: string;
  operatorId: number;
  boardingCityId: number;
  droppingCityId: number;
  busSchedule: [
    {
      id: number;
      time: string;
      date: string;
      passenger: IPassenger[];
      _count: {
        passenger: number;
      };
    }
  ];
}
