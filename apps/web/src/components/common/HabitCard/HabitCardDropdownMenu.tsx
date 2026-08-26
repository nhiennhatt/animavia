import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pin, Trash } from "lucide-react";
import { ReactNode } from "react";

export function HabitCardDropdownMenu({
  children,
  onDelete = () => {},
}: {
  children: ReactNode;
  onDelete?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-20 rounded-sm" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Pin /> Ghim
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete()}>
            <Trash /> Xóa
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
