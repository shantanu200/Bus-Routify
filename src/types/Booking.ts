interface IBusBooking {
  id: number;
  busId: number;
  date: string;
  time: string;
  bus_id: number;
  operator_name: string;
  operator_id: number;
  operator_boarding_city_id: number;
  operator_dropping_city_id: number;
  dropping_city_name: string;
  boarding_city_id: number;
  boarding_city_name: string;
  min_distance: number;
  total_passengers: number;
}

interface IFilter {
  [key: string]: string | number;
}
