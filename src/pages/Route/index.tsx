import { DatePicker } from "@/components/_tailwindui/DatePicker";
import LocationBox from "@/components/_tailwindui/LocationBox";
import LocationSearchBox from "@/components/_tailwindui/LocationSearchBox";
import { ICityGlobal, IPoints } from "@/types/Location";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "@/components/_tailwindui/ErrorText";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Player } from "@lottiefiles/react-lottie-player";
import HeroFile from "@/assets/Logo.json";
import OverlayLayout from "@/components/_tailwindui/OverlayLayout";
import Auth from "@/components/User/Auth";
import { useUserAuthCookie } from "@/hooks/Cookie";
interface IInputErrors {
  boardingLocationError?: string;
  destinationLocationError?: string;
  dateError?: string;
}
const navigation = [
  { name: "Journey", href: "/" },
  // { name: "", href: "#" },
  { name: "Profile", href: "/user/profile" },
  { name: "Company", href: "/operator/dashboard" },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [boardingLocation, setBoardingLocation] = useState<IPoints>();
  const [destinationLocation, setDestinationLocation] = useState<ICityGlobal>();
  const [date, setDate] = useState<string>();
  const navigate = useNavigate();
  const userCookie = useUserAuthCookie();
  const [errors, setErrors] = useState<IInputErrors>({
    boardingLocationError: "",
    destinationLocationError: "",
    dateError: "",
  });

  const handleSubmit = () => {
    let error: IInputErrors = {};
    if (!boardingLocation) {
      error.boardingLocationError = "Please select a boarding location";
    }
    if (!destinationLocation) {
      error.destinationLocationError = "Please select a Dropping City";
    }
    if (!date) {
      error.dateError = "Please select journey date";
    }
    setErrors({ ...errors, ...error });
    if (boardingLocation && destinationLocation && date) {
      navigate(`/route/bus`, {
        state: {
          boardingLocation,
          destinationLocation,
          date,
        },
      });
    }
  };
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {userCookie ? (
              <Link to={"/user/profile"}>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </Link>
            ) : (
              <a
                onClick={() => setOpen(true)}
                className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    onClick={() => setOpen(true)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="relative isolate pt-14">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
          />
        </svg>
        <div>
          <div className="mx-auto max-w-7xl px-6 pt-24 pb-8 sm:pt-32 sm:pb-8 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pt-40 lg:pb-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
              <div className="flex">
                <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="font-semibold text-indigo-600">
                    Embarck Journey
                  </span>
                  <span
                    className="h-4 w-px bg-gray-900/10"
                    aria-hidden="true"
                  />
                  <a href="#" className="flex items-center gap-x-1">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Book Seat
                    <ChevronRightIcon
                      className="-mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
              <h1 className="mt-10 max-w-xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Ride Easy: Your Journey, Our Priority
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Effortless Booking, Comfortable Rides: Discover and Book Your
                Ideal Bus Journey with Just a Few Clicks!
              </p>
            </div>
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
              <Player
                src={HeroFile}
                autoplay
                loop
                className="mx-auto w-[22.875rem] max-w-full drop-shadow-xl"
              />
            </div>
          </div>
          <div className="px-6 mx-auto lg:max-w-7xl">
            <section className="grid sm:grid-cols-7 gap-2  w-full px-6 pb-8 lg:p-8 rounded-lg shadow-sm bg-indigo-600/80">
              <div className="sm:col-span-2">
                <LocationSearchBox
                  isDescriptionRequired={false}
                  placeholder="Boarding Point Of Journey"
                  setLocation={(value: IPoints) => {
                    let error: IInputErrors = {};
                    if (!value) {
                      error.boardingLocationError =
                        "Please select a boarding location";
                    } else {
                      error.boardingLocationError = "";
                      setBoardingLocation(value);
                    }
                    setErrors({ ...errors, ...error });
                  }}
                />
                {errors?.boardingLocationError && (
                  <ErrorText>{String(errors?.boardingLocationError)}</ErrorText>
                )}
              </div>
              <div className="sm:col-span-2">
                <LocationBox
                  placeholder="Dropping City"
                  setLocation={(value: ICityGlobal) => {
                    let error: IInputErrors = {};
                    if (!value) {
                      error.destinationLocationError =
                        "Please select a Dropping City";
                    } else {
                      error.destinationLocationError = "";
                      setDestinationLocation(value);
                    }
                    setErrors({ ...errors, ...error });
                  }}
                />
                {errors?.destinationLocationError && (
                  <ErrorText>
                    {String(errors?.destinationLocationError)}
                  </ErrorText>
                )}
              </div>
              <div className="sm:col-span-2">
                <DatePicker
                  setDateValue={(value: string) => {
                    let error: IInputErrors = {};
                    if (!value) {
                      error.dateError = "Please select journey date";
                    } else {
                      error.dateError = "";
                      setDate(value);
                    }
                    setErrors({ ...errors, ...error });
                  }}
                />
                {errors?.dateError && (
                  <ErrorText>{String(errors?.dateError)}</ErrorText>
                )}
              </div>
              <div className="sm:col-span-1">
                <Button
                  className="w-full"
                  variant={"outline"}
                  onClick={handleSubmit}
                >
                  Search Buses
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
      <OverlayLayout
        open={open}
        setOpen={setOpen}
        children={<Auth closeModal={() => setOpen(false)} />}
      />
    </div>
  );
}
