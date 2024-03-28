import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password";
import { ApiHandler } from "@/server/api";
import { ILogin } from "@/types/Form";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from "react-cookie";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<ILogin>();
  const [loading, setLoading] = useState<boolean>(false);
  const [, setCookie] = useCookies(["accessToken"]);

  const handleOnSubmit: SubmitHandler<ILogin> = async (formData) => {
    setLoading(true);
    const { success, data, message } = await ApiHandler(
      "POST",
      "/operator/login",
      formData,
    );
    setLoading(false);
    if (!success) {
      toast({
        variant: "destructive",
        title: message,
      });
      return;
    }

    setCookie("accessToken", data?.accessToken, {
      expires: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    });
    navigate("/operator/dashboard");
  };
  return (
    <main className="min-h-screen h-full w-full flex items-center justify-center bg-white">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign in to your account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid col-span-1 gap-4"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="john@gmail.com"
                {...register("email")}
              />
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="email">Password</Label>
              <PasswordInput
                type="password"
                id="password"
                {...register("password")}
              />
            </div>
            <div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-400"
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="animate-spin inline-block h-4 mr-2" />
                )}
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
