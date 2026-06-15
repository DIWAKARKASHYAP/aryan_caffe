interface SplashScreenProps {
  tableNumber: number
}

export function SplashScreen({ tableNumber }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-espresso text-cream animate-fade-in">
      <span className="text-6xl mb-4">☕</span>
      <h1 className="font-display text-3xl font-bold mb-2">Brew & Bean</h1>
      <p className="text-cream/80 text-lg">Table {tableNumber} — Welcome!</p>
    </div>
  )
}
