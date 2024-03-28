import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { IPoints } from "@/types/Location";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  points: IPoints[];
  setBoardingPoint: (point: number) => void;
}

export default function PointSelectList({ points, setBoardingPoint }: Props) {
  const [selected, setSelected] = useState<IPoints | null>(null);

  useEffect(() => {
    if (selected) {
      setBoardingPoint(Number(selected?.id));
    }
  }, [selected]);

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
      <div className="space-y-4">
        {points?.map((plan) => (
          <RadioGroup.Option
            key={plan.id}
            value={plan}
            className={({ active }) =>
              classNames(
                active
                  ? "border-indigo-600 ring-2 ring-indigo-600"
                  : "border-gray-300",
                "relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between"
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span className="flex items-center">
                  <span className="flex flex-col text-sm">
                    <RadioGroup.Label
                      as="span"
                      className="font-medium text-gray-900 sm:text-sm text-xs"
                    >
                      {plan.location}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="text-gray-500 sm:text-sm text-xs mt-2 sm:mt-0"
                    >
                      <span className="block sm:inline">{plan.address}</span>{" "}
                      <span
                        className="hidden sm:mx-1 sm:inline"
                        aria-hidden="true"
                      >
                        &middot;
                      </span>{" "}
                    </RadioGroup.Description>
                  </span>
                </span>
                <span
                  className={classNames(
                    active ? "border" : "border-2",
                    checked ? "border-indigo-600" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
