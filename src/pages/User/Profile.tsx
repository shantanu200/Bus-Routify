import Alert from "@/components/_tailwindui/Alert";
import Spinner from "@/components/_tailwindui/Loadder";
import Navbar from "@/components/_tailwindui/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password";
import { useToast } from "@/components/ui/use-toast";
import { useUserAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { IPassenger } from "@/types/Bus";
import nextDateFormat from "@/util/FormatDate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeftRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function UserProfilePage() {
  const [openCancel, setOpenCancel] = useState<boolean>(false);
  const [seletedBooking, setSelectedBooking] = useState<number>(-1);
  const queryClient = useQueryClient();
  const userCookie = useUserAuthCookie();
  const { toast } = useToast();
  const getDataFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
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
    },
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: data?.name,
      email: data?.email,
      contact: data?.contact,
      password: data?.password,
    },
  });

  const handleAPIFunc = async (body: any) => {
    const { data, success, message } = await ApiHandler("PUT", "/user", body, {
      Authorization: `Bearer ${userCookie}`,
    });

    if (!success) {
      toast({
        title: message,
      });
      return;
    }

    return data;
  };

  const submitHandler = async (body: any) => {
    mutate(body);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleAPIFunc,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["user"],
      });
      queryClient.removeQueries({
        queryKey: ["user"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const handleCancelBooking = async () => {
    const { data, success, message } = await ApiHandler(
      "DELETE",
      `/passenger/${seletedBooking}`,
      {},
      {
        Authorization: `Bearer ${userCookie}`,
      }
    );

    if (!success) {
      toast({
        title: message,
      });
      return;
    }

    return data;
  };

  const { mutate: cancelBooking } = useMutation({
    mutationFn: handleCancelBooking,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["user"],
      });
      queryClient.removeQueries({
        queryKey: ["user"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      setSelectedBooking(-1);
      setOpenCancel(false);
    },
  });

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  console.log("2024-03-28" < nextDateFormat());
  return (
    <>
      <Navbar />
      <main className="h-full max-w-7xl mx-auto py-8 px-4 lg:px-8 lg:py-16">
        <div className="">
          <h2 className="text-3xl font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed on booking so be careful what you
            share.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="grid lg:grid-cols-2 gap-y-8 gap-x-4 mt-8"
        >
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Full Name</Label>
            <Input defaultValue={data?.name} {...register("name")} />
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Email</Label>
            <Input defaultValue={data?.email} {...register("email")} />
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Contact Number</Label>
            <Input defaultValue={data?.contact} {...register("contact")} />
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Password</Label>
            <PasswordInput
              defaultValue={data?.password}
              {...register("password")}
            />
          </div>
          <div>
            <Button>
              {isPending && <Loader2Icon className="h-3 w-3 animate-spin" />}
              <span>Update Details</span>
            </Button>
          </div>
        </form>
        <section className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold leading-7 text-gray-900">
              My Bookings
            </h2>
          </div>
          <ul role="list" className="space-y-3 w-full">
            {data?.Booking?.map((booking: IPassenger) => (
              <div
                key={booking.id}
                className="sm:flex border items-center justify-between rounded-sm shadow-sm p-4"
              >
                <div className="sm:flex items-center">
                  <div className="mh-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                    <div className="text-lg rounded-sm bg-indigo-600 text-white font-bold flex flex-col items-center justify-center px-4 py-2">
                      <span>
                        {
                          format(new Date(booking?.date), "dd MMMM yyyy").split(
                            " "
                          )[0]
                        }
                      </span>
                      <span>
                        {
                          format(new Date(booking?.date), "dd MMMM yyyy").split(
                            " "
                          )[1]
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-4 xl:gap-y-0 py-4 xl:py-0">
                    <div className="lg:text-sm text-lg font-medium flex items-center gap-x-4">
                      {booking?.BusSchedule?.bus?.boardingCity?.city?.name}
                      <ArrowLeftRightIcon className="h-4 w-4" />
                      {booking?.BusSchedule?.bus?.droppingCity?.city?.name}
                    </div>
                    <p className="mt-1 text-sm">
                      {booking?.boardingPoint?.location}
                    </p>
                  </div>
                </div>
                <div className="lg:pr-4">
                  {booking?.date >= new Date().toISOString().split("T")[0] &&
                  booking.status !== "CANCELED" ? (
                    <>
                      <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 duration-200 text-sm ring-1 ring-inset ring-indigo-600/10 uppercase">
                        {"Upcoming"}
                      </Badge>
                      <Button
                        size={"sm"}
                        className="ml-4 text-rose-600 hover:bg-red-50 hover:text-rose-600"
                        variant={"outline"}
                        onClick={() => {
                          setSelectedBooking(booking.id);
                          setOpenCancel(true);
                        }}
                      >
                        Cancel Booking
                      </Button>
                    </>
                  ) : booking?.date < new Date().toISOString().split("T")[0] &&
                    booking.status !== "CANCELED" ? (
                    <Badge className="bg-green-50 hover:bg-green-50 text-green-700 duration-200 text-sm ring-1 ring-inset ring-green-600/10 uppercase">
                      {"Completed"}
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50  duration-200 text-sm ring-1 ring-inset ring-rose-600/10">
                      {booking.status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </ul>
        </section>
        <Alert
          title="Cancel Booking"
          description="This action cannot be undone. Are you sure you want to cancel the booking?"
          open={openCancel}
          setOpen={setOpenCancel}
          buttonText="Cancel Booking"
          onSucess={() => {
            cancelBooking();
          }}
        />
      </main>
    </>
  );
}
