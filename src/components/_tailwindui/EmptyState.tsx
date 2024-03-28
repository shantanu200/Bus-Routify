import { PlusIcon } from "@heroicons/react/20/solid";
import { Button } from "../ui/button";

interface Props {
  Icon: React.ElementType;
  buttonText: string;
  titleText: string;
  descriptionText: string;
  handleClick: () => void;
}

export default function EmptyStates({
  Icon,
  buttonText,
  titleText,
  descriptionText,
  handleClick
}: Props) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{titleText}</h3>
      <p className="mt-1 text-sm text-gray-500">{descriptionText}</p>
      <div className="mt-6">
        <Button onClick={handleClick}>
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
