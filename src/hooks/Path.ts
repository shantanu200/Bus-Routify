import { useLocation } from "react-router-dom";

export default function usePath() {
  const location = useLocation();
  return location.pathname;
}
