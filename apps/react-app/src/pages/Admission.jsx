import useRedirect from "../hooks/useRedirect";

const Admission = () => {
  useRedirect("http://localhost:4200", 2000);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold">Redirecting to Login...</h1>
    </div>
  );
};

export default Admission;
