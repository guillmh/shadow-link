import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <div className="pt-2 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-3/4 rounded-sm" />
        <Skeleton className="h-3 w-1/2 rounded-sm" />
      </div>
    </div>
  );
}
