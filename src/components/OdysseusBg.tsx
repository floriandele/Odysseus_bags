import * as React from "react";

/**
 * OdysseusBg — Photorealistic background image of a leather handbag
 * on the deck of a Greek ship, used as a decorative full-page background
 * behind the hero section. Low opacity preserves the gradient overlay.
 */
export function OdysseusBg(): React.ReactElement {
  return (
    <img
      aria-hidden="true"
      alt=""
      src="/odysseus-hero.svg"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.18,
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  );
}
