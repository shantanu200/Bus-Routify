import { Armchair } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState } from "react";
import { Button } from "../ui/button";
import PointSelectList from "./PointSelectList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { ApiHandler } from "@/server/api";
import { useAuthCookie, useUserAuthCookie } from "@/hooks/Cookie";
import { ISchedule } from "@/types/Bus";
import {
  Resolver,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorText from "./ErrorText";
import Spinner from "./Loadder";

const formSchema = yup.object().shape({
  name: yup.string().required("Passenger Full Name is required"),
  contact: yup.string().required("Passenger Phone Number is required"),
});

const schema = yup.object().shape({
  seats: yup.array().of(formSchema),
});

const LOWER_DECK_MATRIX = [
  {
    rows: 1,
    direction: "LEFT",
    columns: 6,
    seats: [["A", "B", "C", "D", "E", "F"]],
  },
  {
    rows: 2,
    direction: "RIGHT",
    columns: 6,
    seats: [
      ["G", "H", "I", "J", "K", "L"],
      ["M", "N", "O", "P", "Q", "R"],
    ],
  },
];

const UPPER_DECK_MATRIX = [
  {
    rows: 1,
    direction: "LEFT",
    columns: 6,
    seats: [["A", "B", "C", "D", "E", "F"]],
  },
  {
    rows: 2,
    direction: "RIGHT",
    columns: 6,
    seats: [
      ["G", "H", "I", "J", "K", "L"],
      ["M", "N", "O", "P", "Q", "R"],
    ],
  },
];
function ToolTipView({
  children,
  seat,
}: {
  children: React.ReactNode;
  seat: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{seat}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface Props {
  data: ISchedule;
  bookedSeat: string[];
}



export default function SeatMatrix({ data, bookedSeat }: Props) {
  const queryClient = useQueryClient();
  const cookie = useAuthCookie();
  const userCookie = useUserAuthCookie();
  const location = useLocation();
  const scheduleId = location.pathname.split("/")[4];
  const userType = location.pathname.split("/")[1];
  console.log(userType);
  const [_seats, setSeats] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState<number>();
  const getDataFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (userType === "user") {
        const cache = getDataFromCache("user");

        if (cache) return cache;
        const { data } = await ApiHandler(
          "GET",
          "/user",
          {},
          {
            Authorization: `Bearer ${userCookie}`,
          }
        );

        return data;
      }
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, any>>({
    resolver: yupResolver(schema) as Resolver<Record<string, any>>,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "seats" as never,
  });

  const submitHandler = (data: any) => {
    if (!boardingPoint) {
      alert("Please select boarding point");
      return;
    }

    mutate(data);
  };

  const handleSelectSeat = (seat: string) => {
    let tempSeats = _seats;
    if (tempSeats.includes(seat)) {
      let index = tempSeats.indexOf(seat);
      remove(index);
      tempSeats = tempSeats.filter((s) => s !== seat);
      setSeats((prev) => prev.filter((s) => s !== seat));
    } else {
      setSeats((prev) => [...prev, seat]);
      tempSeats.push(seat);
      if (tempSeats.length === 1 && userType === "user") {
        append({
          seat: seat,
          name: userData?.name,
          contact: userData?.contact,
          paidAmount: 1000,
        });
      } else {
        append({
          seat: seat,
          name: "",
          contact: "",
          paidAmount: 1000,
        });
      }
    }
  };
  const handleAPIFunc = async (data: any) => {
    console.log(data);
    const { success, message } = await ApiHandler(
      "POST",
      `/passenger/${scheduleId}`,
      data.seats?.map((seat: any) => ({
        ...seat,
        boardingPointId: boardingPoint,
      })),
      {
        Authorization: `Bearer ${userType === "user" ? userCookie : cookie}`,
      }
    );

    if (!success) {
      alert(message);
      return;
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleAPIFunc,
    retry: 1,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [`schedule/${scheduleId}`],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`schedule/${scheduleId}`],
      });

      window.location.reload();
    },
  });

  return (
    <section className="grid xl:grid-cols-2">
      <div className="lg:max-w-2xl">
        <div>
          <div>
            <h1 className="lg:text-lg italic font-medium">Lower Deck</h1>
          </div>
          <div className="border p-4 rounded-lg divide-y-2 divide-dotted">
            <div className="pb-4">
              {LOWER_DECK_MATRIX[0].seats.map((row, rowIdx) => (
                <div className="grid grid-cols-6" key={rowIdx}>
                  {row.map((seat, seatIdx) => (
                    <ToolTipView seat={seat} key={seatIdx}>
                      <Button
                        variant={
                          _seats.includes(`L_${seat}`) ? "default" : "outline"
                        }
                        size={"icon"}
                        disabled={bookedSeat?.includes(`L_${seat}`)}
                        onClick={() => handleSelectSeat(`L_${seat}`)}
                      >
                        <Armchair className="h-12 w-12 cursor-pointer" />
                      </Button>
                    </ToolTipView>
                  ))}
                </div>
              ))}
            </div>
            <div className="pt-4">
              {LOWER_DECK_MATRIX[1].seats.map((row, rowIdx) => (
                <div className="grid grid-cols-6" key={rowIdx}>
                  {row.map((seat, seatIdx) => (
                    <ToolTipView seat={seat} key={seatIdx}>
                      <Button
                        variant={
                          _seats.includes(`L_${seat}`) ? "default" : "outline"
                        }
                        disabled={bookedSeat?.includes(`L_${seat}`)}
                        size={"icon"}
                        onClick={() => handleSelectSeat(`L_${seat}`)}
                      >
                        <Armchair className="h-12 w-12 cursor-pointer" />
                      </Button>
                    </ToolTipView>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div>
            <h1 className="lg:text-lg  font-medium italic">Upper Deck</h1>
          </div>
          <div className="border p-4 rounded-lg divide-y-2 divide-dotted">
            <div className="pb-4">
              {UPPER_DECK_MATRIX[0].seats.map((row, rowIdx) => (
                <div className="grid grid-cols-6" key={rowIdx}>
                  {row.map((seat, seatIdx) => (
                    <ToolTipView seat={seat} key={seatIdx}>
                      <Button
                        variant={
                          _seats.includes(`U_${seat}`) ? "default" : "outline"
                        }
                        disabled={bookedSeat?.includes(`U_${seat}`)}
                        size={"icon"}
                        onClick={() => handleSelectSeat(`U_${seat}`)}
                      >
                        <Armchair className="h-12 w-12 cursor-pointer" />
                      </Button>
                    </ToolTipView>
                  ))}
                </div>
              ))}
            </div>
            <div className="pt-4">
              {UPPER_DECK_MATRIX[1].seats.map((row, rowIdx) => (
                <div className="grid grid-cols-6" key={rowIdx}>
                  {row.map((seat, seatIdx) => (
                    <ToolTipView seat={seat} key={seatIdx}>
                      <Button
                        variant={
                          _seats.includes(`U_${seat}`) ? "default" : "outline"
                        }
                        size={"icon"}
                        disabled={bookedSeat?.includes(`U_${seat}`)}
                        onClick={() => handleSelectSeat(`U_${seat}`)}
                      >
                        <Armchair className="h-12 w-12 cursor-pointer" />
                      </Button>
                    </ToolTipView>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {_seats.length > 0 && (
          <div className="mt-8 border rounded-lg p-4  text-sm">
            <p>Selected Seats: {_seats.join(", ")}</p>
          </div>
        )}
      </div>

      {_seats.length > 0 && (
        <div className="mt-8 lg:mt-0">
          <div className="">
            <h1 className="text-lg font-medium italic mb-4">
              Boarding Point Location
            </h1>
            <div>
              <PointSelectList
                setBoardingPoint={setBoardingPoint}
                points={data?.bus?.boardingCity?.OperatorCityPoints}
              />
            </div>
          </div>
          <div className="mt-8">
            <h1 className="text-lg font-medium italic mb-4">Booking Details</h1>
            <form onSubmit={handleSubmit(submitHandler)}>
              {fields.map((field, idx: number) => (
                <main
                  className="border mb-8 p-4 rounded-lg shadow-sm"
                  key={field.id}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid w-full max-w-full items-center gap-1.5">
                      <Label>Seat Number</Label>
                      <Input
                        disabled
                        className="font-bold italic"
                        defaultValue={_seats[idx]}
                      />
                    </div>
                    <div className="grid w-full max-w-full items-center gap-1.5">
                      <Label>Full Name</Label>
                      <Input {...register(`seats.${idx}.name` as const)} />
                      {(errors.seats as any)?.[idx]?.name && (
                        <ErrorText>
                          {String((errors.seats as any)?.[idx]?.name?.message)}
                        </ErrorText>
                      )}
                    </div>
                    <div className="grid w-full max-w-full items-center gap-1.5">
                      <Label>Phone Number</Label>
                      <Input {...register(`seats.${idx}.contact` as const)} />
                      {(errors?.seats as any)?.[idx]?.contact && (
                        <ErrorText>
                          {String((errors?.seats as any)?.[idx]?.contact?.message)}
                        </ErrorText>
                      )}
                    </div>
                  </div>
                </main>
              ))}
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner />} Book Seat
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
