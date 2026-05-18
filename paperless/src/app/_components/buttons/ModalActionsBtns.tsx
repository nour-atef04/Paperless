import { FaSpinner } from "react-icons/fa6";

type ModalActionBtnsProps = {
  onCancel: () => void;
  onSubmit?: () => void;
  isPending?: boolean;
  isSubmitDisabled?: boolean;

  // Standard (Desktop) Text
  submitText?: string;
  loadingText?: string;
  cancelText?: string;

  // Mobile Text
  submitTextMobile?: string;
  loadingTextMobile?: string;
  cancelTextMobile?: string;
};

export default function ModalActionBtns({
  onCancel,
  onSubmit,
  isPending = false,
  isSubmitDisabled = false,
  submitText = "Submit",
  loadingText = "Saving...",
  cancelText = "Cancel",
  submitTextMobile,
  loadingTextMobile,
  cancelTextMobile,
}: ModalActionBtnsProps) {
  const isDisabled = isPending || isSubmitDisabled;

  return (
    <div className="flex justify-end gap-3">
      {/* cancel */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="text-brand-light cursor-pointer px-4 py-2 text-xs hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
      >
        {cancelTextMobile ? (
          <>
            <span className="sm:hidden">{cancelTextMobile}</span>
            <span className="hidden sm:inline">{cancelText}</span>
          </>
        ) : (
          cancelText
        )}
      </button>

      {/* submit */}
      <button
        type="submit"
        disabled={isDisabled}
        onClick={onSubmit}
        className={`${
          isDisabled
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-brand-light cursor-pointer"
        } btn-primary flex items-center justify-center rounded-md px-4 py-2 text-xs transition-colors sm:text-sm`}
        aria-live="polite"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <FaSpinner aria-hidden="true" className="animate-spin" />

            {loadingTextMobile ? (
              <>
                <span className="sm:hidden">{loadingTextMobile}</span>
                <span className="hidden sm:inline">{loadingText}</span>
              </>
            ) : (
              <span>{loadingText}</span>
            )}
          </span>
        ) : (
          <>
            {submitTextMobile ? (
              <>
                <span className="sm:hidden">{submitTextMobile}</span>
                <span className="hidden sm:inline">{submitText}</span>
              </>
            ) : (
              submitText
            )}
          </>
        )}
      </button>
    </div>
  );
}
