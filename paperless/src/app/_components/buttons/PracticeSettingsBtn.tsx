"use client";

import { useEffect, useState, useTransition } from "react";
import { PiGearSixLight } from "react-icons/pi";
import Modal from "../ui/Modal";
import FormInput from "../ui/FormInput";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

export default function PracticeSettingsBtn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openModal, setOpenModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [count, setCount] = useState(Number(searchParams.get("count")) || 3);
  const [type, setType] = useState(searchParams.get("type") || "mixed");
  const [focusArea, setFocusArea] = useState(
    searchParams.get("focusArea") || "",
  );

  // when the URL successfully changes (meaning the AI finished and the new quiz loaded), close the modal
  useEffect(() => {
    setOpenModal(false);
  }, [searchParams]);

  const handleSave = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("count", count.toString());
      params.set("type", type);
      params.set("focusArea", focusArea);

      router.push(`?${params.toString()}`);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="mt-2 transition-transform hover:scale-110 active:scale-95"
        aria-label="Practice Settings"
      >
        <PiGearSixLight
          className="text-brand-light hover:text-brand hover:cursor-pointer"
          size={25}
        />
      </button>
      {openModal && (
        <Modal
          title="Practice Quiz Settings"
          onClose={() => !isPending && setOpenModal(false)}
          isOpen={openModal}
        >
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
                  <div className="flex gap-2 items-center">
                    <FaSpinner className="animate-spin" />
                    Generating...
                  </div>
                ) : (
                  "Save & Restart Quiz"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
