"use client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const LogoutModal = ({ open, onOpenChange, onConfirm }: LogoutModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
            <CircleAlert className="text-red-500"/>
          </div>
          <DialogTitle className="text-center font-semibold text-2xl">Are you sure you want to logout ?</DialogTitle>
          <DialogDescription className="text-center text-description text-sm">
            You can log back in anytime to continue where you left off.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-center gap-3 sm:justify-center">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            Cancel
          </button>
          <Button
            
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="min-w-25"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutModal;