interface OrderSuccessProps {
  tableNumber: number
}

export function OrderSuccess({ tableNumber }: OrderSuccessProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream px-6 animate-fade-in">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="font-display text-2xl font-bold text-espresso text-center mb-2">
        Order placed!
      </h2>
      <p className="text-espresso/60 text-center text-lg">
        We&apos;ll bring it to Table {tableNumber} shortly.
      </p>
    </div>
  )
}
