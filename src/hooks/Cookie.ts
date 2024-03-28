import { useCookies } from "react-cookie";

export function useAuthCookie(): string {
  const [cookies] = useCookies(["accessToken"]);

  return cookies.accessToken;
}

export function useUserAuthCookie(): string {
  const [cookies] = useCookies(["userToken"]);

  return cookies?.userToken;
}
