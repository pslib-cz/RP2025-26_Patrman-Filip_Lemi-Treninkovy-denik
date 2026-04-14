"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
  deleteAction: () => void;
}

export function DeleteSessionForm({ deleteAction }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        type="button"
        className="w-full mt-4 bg-transparent border-2 border-red-100 text-red-500 hover:bg-red-50 active:scale-95 transition-all p-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
      >
        <Trash2 className="w-5 h-5" />
        Delete Session
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pb-8 px-4 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl mx-auto animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mt-2">
                <Trash2 className="w-8 h-8" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-slate-900">Delete Session?</h3>
                <p className="text-sm font-medium text-slate-500 px-2">
                  This action cannot be undone. All jumps and routines within this session will be permanently lost.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full mt-4">
                <form action={deleteAction} className="w-full">
                  <button
                    type="submit"
                    className="w-full bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all p-3.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-md gap-2"
                  >
                    Yes, delete it
                  </button>
                </form>
                
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-transparent border-2 border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 transition-all p-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
