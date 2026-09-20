import { useEffect, useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

type OtpInputProps = {
  /** How many digit boxes to show (default 6). */
  length?: number;
  /** The code typed so far, e.g. "482913". */
  value: string;
  /** Called whenever the code changes. */
  onChange: (value: string) => void;
  /** Disables all boxes (e.g. while verifying). */
  disabled?: boolean;
  /** Turn the boxes red (used after a wrong code). */
  hasError?: boolean;
};

/**
 * A row of single-digit boxes for entering a code like the email OTP.
 * - Only digits can be typed.
 * - Typing a digit jumps to the next box; Backspace goes back.
 * - Pasting a full code fills every box at once.
 */
export function OtpInput({ length = 6, value, onChange, disabled, hasError }: OtpInputProps) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty box when the component appears on screen.
  useEffect(() => {
    const firstEmptyIndex = Math.min(value.length, length - 1);
    boxes.current[firstEmptyIndex]?.focus();
    // Only run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function focusBox(index: number) {
    boxes.current[index]?.focus();
    boxes.current[index]?.select();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      // Empty box → move back; filled box → the digit is deleted by onChange.
      if (!value[index] && index > 0) focusBox(index - 1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, ""); // strip anything that isn't 0-9
    if (!digit) return;

    const next = value.slice(0, index) + digit + value.slice(index + 1);
    onChange(next.slice(0, length));

    // Auto-advance to the next box.
    if (index < length - 1) focusBox(index + 1);
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    event.preventDefault();
    onChange(pasted);

    // Land the cursor on the box after the pasted digits.
    const lastIndex = Math.min(pasted.length, length - 1);
    boxes.current[lastIndex]?.focus();
  }

  const boxClass = `size-11 rounded-lg border text-center text-lg font-semibold text-white outline-none transition placeholder:text-gray-500 focus:border-brand ${
    hasError ? "border-red-500/70 bg-red-500/5" : "border-line bg-surface"
  }`;

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          value={value[index] ?? ""}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={boxClass}
        />
      ))}
    </div>
  );
}
