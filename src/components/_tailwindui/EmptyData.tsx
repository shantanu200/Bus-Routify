import ImageBanner from "@/assets/EmptyData.svg";
export default function EmptyData({ desctiption }: { desctiption: string }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center my-16">
      <img src={ImageBanner} />
      <p className="font-medium italic">{desctiption}</p>
    </div>
  );
}
