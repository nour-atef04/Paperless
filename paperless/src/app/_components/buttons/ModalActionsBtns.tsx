import { FaSpinner } from "react-icons/fa6";

type ModalActionBtnsProps = {
  onCancel: () => void;
  onSubmit: () => void;
  isPending?: boolean;
  isSubmitDisabled?: boolean;
  submitText?: string;
  loadingText?: string;
  cancelText?: string;
};

export default function ModalActionBtns({
  onCancel,
  onSubmit,
  isPending = false,
  isSubmitDisabled = false,
  submitText = "Submit",
  loadingText = "Saving...",
  cancelText = "Cancel",
}: ModalActionBtnsProps) {
  const isDisabled = isPending || isSubmitDisabled;

  return (
    <div className="mt-4 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="text-brand-light cursor-pointer px-4 py-2 text-sm hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isDisabled}
        onClick={onSubmit}
        className={`${
          isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } btn-primary flex items-center justify-center rounded-md px-4 py-2`}
        aria-live="polite"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <FaSpinner aria-hidden="true" className="animate-spin" />
            <span>{loadingText}</span>
          </span>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
}
