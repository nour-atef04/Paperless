"use client";

import { useEffect, useState, useTransition } from "react";
import { PiGearSixLight } from "react-icons/pi";
import Modal from "../ui/Modal";
import FormInput from "../ui/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

type PracticeSettingsBtnProps = {
  mode?: "practice-new" | "review";
  notes?: { id: string; name: string }[];
};

export default function PracticeSettingsBtn({
  mode = "practice-new",
  notes = [],
}: PracticeSettingsBtnProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openModal, setOpenModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [count, setCount] = useState(Number(searchParams.get("count")) || 3);
  const [type, setType] = useState(searchParams.get("type") || "mixed");
  const [focusArea, setFocusArea] = useState(
    searchParams.get("focusArea") || "",
  );

  // state for "review" mode
  const [reviewNoteId, setReviewNoteId] = useState(
    searchParams.get("noteId") || "all",
  );

  const [shuffle, setShuffle] = useState(
    searchParams.get("shuffle") === "true",
  );

  // when the URL successfully changes (meaning the AI finished and the new quiz loaded), close the modal
  useEffect(() => {
    setOpenModal(false);
  }, [searchParams]);

  const handleSave = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (shuffle) {
        params.set("shuffle", "true");
      } else {
        params.delete("shuffle");
      }

      if (mode === "practice-new") {
        let safeCount = count;
        if (isNaN(safeCount) || safeCount < 1) safeCount = 1;
        if (safeCount > 20) safeCount = 20;

        params.set("count", safeCount.toString());
        params.set("type", type);
        if (focusArea) {
          params.set("focusArea", focusArea);
        } else {
          params.delete("focusArea");
        }
      } else if (mode === "review") {
        if (reviewNoteId === "all") {
          params.delete("noteId"); // clear filter
        } else {
          params.set("noteId", reviewNoteId);
        }
      }

      router.push(`?${params.toString()}`);
    });
  };

  const noteSelectOptions = [
    { id: "all", name: "All Notes (Mixed Review)" },
    ...notes,
  ];

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="mt-2 transition-transform hover:scale-110 active:scale-95"
        aria-label={mode === "review" ? "Review Settings" : "Practice Settings"}
      >
        <PiGearSixLight
          className="text-brand-light hover:text-brand hover:cursor-pointer"
          size={25}
        />
      </button>
      {openModal && (
        <Modal
          title={
            mode === "review"
              ? "Targeted Review Settings"
              : "Practice Quiz Settings"
          }
          onClose={() => !isPending && setOpenModal(false)}
          isOpen={openModal}
        >
          {/* ------ UI for practice mode ------ */}
          {mode === "practice-new" && (
            <div className="flex flex-col gap-8 py-2">
              {/* No. of Questions */}
              <div className="flex flex-col gap-4">
                <FormInput
                  name="count"
                  id="count"
                  label="Number of Questions (1-20)"
                  type="number"
                  showLabel={true}
                  variant="variant2"
                  defaultValue={count.toString()}
                  onChange={(e) => setCount(Number(e.target.value))}
                  disabled={isPending}
                  min={1}
                  max={20}
                />
              </div>

              {/* Qn Type */}
              <div className="flex flex-col gap-4">
                <FormInput
                  name="type"
                  id="type"
                  label="Question Type"
                  showLabel={true}
                  selectInput={true}
                  variant="variant2"
                  value={type}
                  disabled={isPending}
                  onChange={(e) => setType(e.target.value)}
                  selectOptions={[
                    { id: "mixed", name: "Mixed (MCQ & Written)" },
                    { id: "mcq_only", name: "Multiple Choice Only" },
                    { id: "written_only", name: "Written Only" },
                  ]}
                />
              </div>

              {/* Focus Area */}
              <div className="flex flex-col gap-4">
                <FormInput
                  name="focusArea"
                  id="focusArea"
                  label="Focus Area (Optional)"
                  type="text"
                  placeholder="e.g., specific terms, dates, concepts..."
                  showLabel={true}
                  variant="variant2"
                  disabled={isPending}
                  defaultValue={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ------ UI for review mode ------ */}
          {mode === "review" && (
            <div className="flex flex-col gap-4">
              <FormInput
                name="reviewNote"
                id="reviewNote"
                label="Filter by Note"
                showLabel={true}
                selectInput={true}
                variant="variant2"
                value={reviewNoteId}
                disabled={isPending || notes.length === 0}
                onChange={(e) => setReviewNoteId(e.target.value)}
                selectOptions={noteSelectOptions}
              />
              {notes.length === 0 && (
                <p className="text-brand-light mt-1 text-xs">
                  You don&apos;t have any saved questions tied to specific notes
                  yet.
                </p>
              )}

              <div className="border-brand-light/20 flex items-center justify-between gap-4 rounded-lg border p-4">
                <div>
                  <label
                    htmlFor="shuffleToggle"
                    className="text-brand-dark text-sm font-medium"
                  >
                    Shuffle Questions
                  </label>
                  <p className="text-brand-light mt-0.5 text-xs">
                    Randomize the order of the questions in this session.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="shuffleToggle"
                  checked={shuffle}
                  onChange={(e) => setShuffle(e.target.checked)}
                  disabled={isPending}
                  className="text-brand focus:ring-brand h-5 w-5 cursor-pointer rounded border-gray-300 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Action Btns */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setOpenModal(false)}
              disabled={isPending}
              className="text-brand hover:bg-brand/5 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="bg-brand hover:bg-brand-light rounded-full px-6 py-2 text-sm font-medium text-white transition-all hover:scale-[0.98] hover:cursor-pointer active:scale-[0.96] disabled:cursor-wait disabled:opacity-70"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Generating...
                </div>
              ) : (
                "Save & Restart Quiz"
              )}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
