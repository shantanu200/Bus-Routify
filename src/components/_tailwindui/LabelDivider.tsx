interface Props {
  label: string;
}
export default function LabelDivider({ label }: Props) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-start">
        <span className="bg-white pr-2 text-sm text-gray-500">{label}</span>
      </div>
    </div>
  );
}
