import Skeleton from "react-loading-skeleton";

const SkeletonLoader = () => {
  return (
    <div className="container-fluid py-4">
      <Skeleton count={1} height={30} />
      <div style={{ height: "10px" }} />
      <Skeleton count={1} height={30} />
      <div style={{ height: "10px" }} />
      <Skeleton count={1} height={30} />
      <div style={{ height: "10px" }} />
      <Skeleton count={1} height={30} />
    </div>
  );
};

export default SkeletonLoader;
