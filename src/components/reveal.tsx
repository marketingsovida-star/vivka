import { type ElementType, type ImgHTMLAttributes, type ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "fade";
  immediate?: boolean;
  id?: string;
};

export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay,
  variant = "up",
  immediate = false,
  id,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>({ immediate });
  const base = variant === "fade" ? "reveal reveal-fade" : "reveal reveal-up";
  return (
    <Tag
      ref={ref as never}
      id={id}
      data-delay={delay}
      className={`${base}${visible ? " reveal-in" : ""} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

type RevealImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
  delay?: number;
};

export function RevealImage({ wrapperClassName = "", delay, className = "", ...imgProps }: RevealImageProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-delay={delay} className={`reveal-image-wrap ${wrapperClassName}`.trim()}>
      <img decoding="async" {...imgProps} className={`reveal-image${visible ? " reveal-in" : ""} ${className}`.trim()} />
    </div>
  );
}
