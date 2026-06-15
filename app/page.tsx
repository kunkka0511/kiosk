import MandalaKiosk from "./components/kiosk/MandalaKiosk";
import ErrorBoundary from "./components/kiosk/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <MandalaKiosk />
    </ErrorBoundary>
  );
}
