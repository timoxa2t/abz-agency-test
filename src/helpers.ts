import { MutableRefObject } from "react";

export const scrollTo = (ref: MutableRefObject<HTMLDivElement | null>) => {
  if (ref && ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }
}