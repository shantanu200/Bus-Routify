import Spinner from "@/components/_tailwindui/Loadder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password";
import { useToast } from "@/components/ui/use-toast";
import { useAuthCookie } from "@/hooks/Cookie";
import { ApiHandler } from "@/server/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

export default function OperatorProfilePage() {
  const queryClient = useQueryClient();
  const cookie = useAuthCookie();
  const { toast } = useToast();
  const getDataFromCache = (key: string) => {
    return queryClient.getQueryData([key]);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["operator"],
    queryFn: async () => {
      const cache = getDataFromCache("operator");

      if (cache) return cache;

      const { data } = await ApiHandler(
        "GET",
        "/operator",
        {},
        {
          Authorization: `Bearer ${cookie}`,
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
    const { data, success, message } = await ApiHandler(
      "PUT",
      "/operator",
      body,
      {
        Authorization: `Bearer ${cookie}`,
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

  const { mutate, isPending } = useMutation({
    mutationFn: handleAPIFunc,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["operator"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["operator"],
      });
    },
  });

  const submitHandler = async (body: any) => {
    mutate(body);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="h-full max-w-7xl mx-auto py-8 lg:py-16">
      <div className="">
        <h2 className="text-3xl font-semibold leading-7 text-gray-900">
          Operator Profile
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          This information will be displayed on booking so be careful what you
          share.
        </p>
      </div>
      <div>
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
      </div>
    </main>
  );
}
