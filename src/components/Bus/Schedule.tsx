import { Label } from "../ui/label";
import { CalendarDaysIcon, Loader2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { DatePicker } from "../_tailwindui/DatePicker";
import { useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ISchedule } from "@/types/Bus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHandler } from "@/server/api";
import { useAuthCookie } from "@/hooks/Cookie";
import ErrorText from "../_tailwindui/ErrorText";

interface Props {
  busName: string;
  busId: number;
  closeModel: () => void;
}

const schema = yup.object().shape({
  time: yup
    .string()
    .matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Time must be in the format HH:MM")
    .required("Time is required"),
});

export default function BusScheduleForm({ busName, busId, closeModel }: Props) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const cookie = useAuthCookie();

  const handleAPIFunc = async (data: Partial<ISchedule>) => {
    const { success, message } = await ApiHandler(
      "POST",
      `/bus/schedule/${busId}`,
      {
        ...data,
        date,
      },
      {
        Authorization: `Bearer ${cookie}`,
      }
    );

    if (!success) {
      alert(message);
      return;
    }

    closeModel();
  };

  const submitHandler = (data: Partial<ISchedule>) => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    mutate({
      ...data,
      date,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleAPIFunc,
    retry: 1,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [`bus/${busId}`],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`bus/${busId}`],
      });
    },
  });
  return (
    <section className="grid col-span-1 gap-4">
      <div>
        <div className="text-lg font-medium flex shrink-0 gap-2">
          <CalendarDaysIcon />
          <span>Schedule</span>
        </div>
        <p className="text-sm mt-1 text-gray-500">Create schedule for bus.</p>
      </div>
      <div>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="grid grid-cols-1 gap-4"
        >
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Bus Name</Label>
            <Input value={busName} disabled />
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Date</Label>
            <DatePicker setDateValue={setDate} />
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Time</Label>
            <Input
              type="text"
              placeholder="Enter Time of departure"
              {...register("time")}
            />
            {errors.time && (
              <ErrorText>{String(errors.time.message)}</ErrorText>
            )}
          </div>
          <div>
            <Button disabled={isPending} className="w-full">
              {isPending && <Loader2Icon className="animate-spin w-3 h-3" />}
              Submit
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
