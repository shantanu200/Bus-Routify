import PassengerGrid from "@/components/Passenger/DataGrid";
import { DatePicker } from "@/components/_tailwindui/DatePicker";
import EmptyData from "@/components/_tailwindui/EmptyData";
import Spinner from "@/components/_tailwindui/Loadder";
import { Input } from "@/components/ui/input";
import { useAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { IPassengerBooking } from "@/types/Bus";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function PassengerPage() {
  const cookie = useAuthCookie();

  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { data, isLoading } = useQuery({
    queryKey: ["passengers", date],
    queryFn: async () => {
      const { data, success, message } = await ApiHandler(
        "GET",
        `/bus/schedule-operator?date=${date}&q=`,
        {},
        {
          Authorization: `Bearer ${cookie}`,
        }
      );

      if (!success) {
        alert(message);
        return;
      }
      return data as IPassengerBooking[];
    },
  });

  console.log(data);

  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Passengers
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4  mt-8">
        <Input
          className="col-span-2"
          placeholder="Search Details of Passenger by Name,Location and Seat Number"
        />
        <DatePicker setDateValue={setDate} defaultDate={date} />
      </div>
      {isLoading ? (
        <Spinner />
      ) : data && data?.length > 0 ? (
        <PassengerGrid data={data} />
      ) : (
        <EmptyData desctiption="No Bus Details found for date" />
      )}
    </main>
  );
}
