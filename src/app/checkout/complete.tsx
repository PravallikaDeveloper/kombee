import StepProgressBar from "@/components/stepprogessbar";


export default function Complete() {
  return (
    <>
      <StepProgressBar />
      <div className="max-w-3xl mx-auto p-4 mt-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Completed 🎉</h1>
        <p>Thank you for your purchase!</p>
      </div>
    </>
  );
}
