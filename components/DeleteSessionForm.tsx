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
        className="w-full mt-4 bg-transparent border-2 border-destructive/20 text-destructive hover:bg-destructive/5 active:scale-95 transition-all p-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
      >
        <Trash2 className="w-5 h-5" />
        Delete Session
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-[32px] p-6 shadow-2xl mx-auto animate-in zoom-in-95 duration-300 border border-border">
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mt-2">
                <Trash2 className="w-8 h-8" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-foreground">Delete Session?</h3>
                <p className="text-sm font-medium text-muted-foreground px-2">
                  This action cannot be undone. All jumps and routines within this session will be permanently lost.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full mt-4">
                <form action={deleteAction} className="w-full">
                  <button
                    type="submit"
                    className="w-full bg-destructive text-white hover:bg-destructive/90 active:scale-95 transition-all p-3.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-md gap-2"
                  >
                    Yes, delete it
                  </button>
                </form>
                
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-transparent border-2 border-border text-muted-foreground hover:bg-muted active:scale-95 transition-all p-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
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
