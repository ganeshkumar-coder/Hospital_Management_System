const Spinner = ({ size = "md" }) => {
  const s =
    size === "sm" ? "w-4 h-4 border-2" :
    size === "lg" ? "w-10 h-10 border-4" :
                    "w-6 h-6 border-2";

  return (
    <div className={`${s} border-teal-200 border-t-teal-600 rounded-full animate-spin`} />
  );
};

export default Spinner;