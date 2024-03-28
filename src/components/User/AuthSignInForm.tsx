import { Loader2, UserIcon } from "lucide-react";
import ErrorText from "../_tailwindui/ErrorText";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiHandler } from "@/server/api";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IUser } from "@/types/User";
import { useToast } from "../ui/use-toast";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../ui/password";

const validationSchemaForm = yup.object().shape({
  contact: yup
    .string()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Phone number is not valid")
    .required("Please enter your phone number"),
  password: yup.string().required("Password is required"),
});

interface Props {
  changeForm: () => void;
  closeModal: () => void;
}

export default function AuthSignInForm({ changeForm, closeModal }: Props) {
  const [, setCookie] = useCookies(["userToken"]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchemaForm),
  });

  const handleAPIFunc = async (reqBody: Partial<IUser>) => {
    const { success, data, message } = await ApiHandler(
      "POST",
      `/user/login`,
      reqBody
    );

    if (!success) {
      toast({
        title: message,
      });
      return;
    }

    setCookie("userToken", data?.accessToken, {
      path: "/",
      maxAge: 3600 * 24 * 7,
      secure: true,
      sameSite: "none",
      httpOnly: false,
    });

    toast({
      description: "User Logged In",
    });
    closeModal();
    return data;
  };

  const submitHandler = async (data: Partial<IUser>) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleAPIFunc,
    retry: 1,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["buses"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buses"],
      });
    },
  });

  return (
    <section className="grid col-span-1 gap-4">
      <div>
        <div className="text-lg font-medium flex shrink-0 gap-2">
          <UserIcon />
          <span>Sign In</span>
        </div>
        <p className="text-sm mt-1 text-gray-500">
          Please enter your details to sign in
        </p>
      </div>
      <div>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="grid col-span-1 gap-4"
        >
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Phone Number</Label>
            <Input
              placeholder="e.g. +91-XXXXX-XXXXX"
              {...register("contact")}
            />
            {errors.contact && (
              <ErrorText>{errors.contact?.message as string}</ErrorText>
            )}
          </div>
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Label>Password</Label>
            <PasswordInput {...register("password")} />
            {errors.password && (
              <ErrorText>{errors.password?.message as string}</ErrorText>
            )}
          </div>
          <div>
            <Button
              className="w-full flex items-center gap-2"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>Submit</span>
            </Button>
          </div>
        </form>
        <div className="mt-4">
          <p className="text-center">
            Don't have an account?{" "}
            <a href="#" onClick={changeForm} className="text-indigo-500">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
