"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props<number | readonly number[]>) {
  const values: readonly number[] = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [value ?? defaultValue ?? min];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Control className="flex w-full items-center py-2">
        <SliderPrimitive.Track className="relative h-1.5 w-full grow select-none rounded-full bg-muted">
          <SliderPrimitive.Indicator className="select-none rounded-full bg-primary" />
          {values.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              index={index}
              aria-label={
                values.length === 1 && props["aria-label"]
                  ? props["aria-label"]
                  : index === 0
                    ? "Minimum"
                    : "Maximum"
              }
              aria-labelledby={
                values.length === 1 ? props["aria-labelledby"] : undefined
              }
              className="block size-4.5 cursor-grab rounded-full border-2 border-primary bg-card shadow-sm transition-shadow select-none hover:ring-4 hover:ring-primary/20 active:cursor-grabbing has-focus-visible:ring-4 has-focus-visible:ring-ring/40"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
