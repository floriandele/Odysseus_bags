import * as React from "react";
import { CartProvider } from "@/context/CartContext";
import { HomePage } from "@/pages/HomePage";
import "@/styles/theme.css";

/**
 * App — root component wrapping the entire application.
 * Provides the CartProvider context globally.
 */
export function App(): React.ReactElement {
  return (
    <CartProvider>
      <HomePage />
    </CartProvider>
  );
}

export default App;
