import ModalActionBtns from "../buttons/ModalActionsBtns";
import Modal from "../ui/Modal";

type VisibilityModalProps = {
  onClose: () => void;
  action: (payload: FormData) => void;
  isPublic: boolean;
  isPending: boolean;
  variant: "note" | "folder";
  isParentFolderPrivate?: boolean; // for notes
  parentFolderName?: string;
};

export default function VisibilityModal({
  onClose,
  action,
  isPublic,
  isPending,
  variant,
  isParentFolderPrivate,
  parentFolderName,
}: VisibilityModalProps) {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Make ${variant[0].toUpperCase() + variant.slice(1)} ${isPublic ? "Private" : "Public"}`}
    >
      <form action={action} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-brand-light">
            {isPublic
              ? `This ${variant} will be hidden from your public profile. Only you will be able to view and edit it.`
              : `This ${variant} will be visible on your public profile. Anyone with the link will be able to read it.`}
          </p>

          {/* only show if it's a note, it's being made public, AND parent is private */}
          {variant === "note" && !isPublic && isParentFolderPrivate && (
            <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600">
              ⚠️ This note is currently inside the
              private folder <em>&quot;{parentFolderName}&quot;</em>. Making this specific
              note public means it <strong>will</strong> appear on your public
              profile, even though the rest of the folder remains hidden.
            </div>
          )}
        </div>

        <ModalActionBtns
          onCancel={onClose}
          isPending={isPending}
          submitText="Confirm Change"
          loadingText="Updating..."
        />
      </form>
    </Modal>
  );
}
