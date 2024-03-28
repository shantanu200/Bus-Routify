import { useState } from "react";
import AuthSignInForm from "./AuthSignInForm";
import AuthSignUpForm from "./AuthSignUpForm";

interface Props {
  closeModal: () => void;
}

export default function Auth({ closeModal }: Props) {
  const [isSigIn, setIsSignIn] = useState<boolean>(true);
  return isSigIn ? (
    <AuthSignInForm closeModal={closeModal}  changeForm={() => setIsSignIn(false)} />
  ) : (
    <AuthSignUpForm closeModal={closeModal} changeForm={() => setIsSignIn(true)} />
  );
}
