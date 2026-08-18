import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";

export function DeleteConfirmationDialog({
  name,
  onConfirm,
  onClose,
}: {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog
      defaultOpen
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle className="text-xl">Xác nhận xóa</DialogTitle>
        <DialogDescription>Bạn có thực sự muốn xoá "{name}"?</DialogDescription>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Huỷ
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            <Trash />
            Xoá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
