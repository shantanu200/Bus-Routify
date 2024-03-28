import SeatMatrix from "@/components/_tailwindui/SeatMatrix";
import { useAuthCookie, useUserAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { ISchedule } from "@/types/Bus";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

export default function ScheduleViewPage() {
  const location = useLocation();
  const id = location.pathname.split("/")[4];
  const cookie = useAuthCookie();
  const userCookie = useUserAuthCookie();
  const { data } = useQuery({
    queryKey: [`schedule/${id}`],
    queryFn: async () => {
      const response = await ApiHandler(
        "GET",
        `/bus/schedule-day/${id}`,
        {},
        {
          Authorization: `Bearer ${cookie || userCookie}`,
        }
      );

      return response.data as ISchedule;
    },
  });

  return (
    <main className="w-full">
      <p>Select Seat and enjoy Journey</p>
      <div className="mt-8 w-full">
        <SeatMatrix
          data={data as ISchedule}
          bookedSeat={data?.passenger.map((user) => user.seat) as string[]}
        />
      </div>
    </main>
  );
}
