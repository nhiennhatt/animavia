"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, NotebookPen, Pause } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { QueryError } from "@/errors/QueryError";
import { logHabit } from "@/services/habit-log-service";
import { useLogHabit } from "@/store/use-log-habit";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";

export function LogModal() {
  const queryClient = useQueryClient();
  const habit = useLogHabit((state) => state.habit);
  const clearLogHabit = useLogHabit((state) => state.clearLogHabit);
  const { mutate: handleLog, isPending: isLogging } = useMutation({
    mutationFn: async ({
      habitId,
      forDate,
    }: {
      habitId: string;
      forDate: number;
    }) => {
      const res = await refreshableQuery(() => logHabit(habitId, forDate));

      if (!res.success) {
        throw new QueryError(res.code, res.error);
      }

      if (res.data === null) {
        throw new QueryError("ALREADY_LOG", undefined);
      }
    },
    onError: (error) => {
      if (error instanceof QueryError) {
        if (
          error.code === "OUT_OF_DATE" ||
          error.code === "FUTURE_TARGET_DATE"
        ) {
          toast.error("Đã quá hạn ghi nhận.");
          return clearLogHabit();
        }

        if (error.code === "ALREADY_LOG") {
          toast.error("Bạn đã ghi nhận rồi nè");
          return;
        }
      }
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      clearLogHabit();
    },
  });

  return (
    <Dialog
      open={!!habit}
      onOpenChange={() => {
        if (!isLogging) {
          clearLogHabit();
        }
      }}
    >
      <DialogContent className="rounded-sm max-w-xl!" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-3xl font-medium font-sans text-primary">
            {habit?.habitName || "......"}
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="flex gap-4 text-primary py-2 max-md:flex-col-reverse">
          <Button
            variant="outline"
            className="flex-1 rounded-sm text-base font-normal bg-accent text-neutral-700 hover:bg-accent/60"
            onClick={() => {
              clearLogHabit();
            }}
          >
            <Pause />
            Mình làm sau nè
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-sm text-base text-primary! hover:bg-background/50!"
            onClick={() => {
              if (habit) handleLog(habit);
            }}
          >
            <BadgeCheck />
            Đã hoàn thành
          </Button>
        </div>
        <Item variant="outline" className="rounded flex-wrap">
          <ItemMedia>
            <NotebookPen />
          </ItemMedia>
          <ItemContent>
            <ItemHeader>
              <ItemTitle className="text-primary">Ghi chép cảm nghĩ</ItemTitle>
            </ItemHeader>
            <ItemDescription className="text-neutral-500">
              Bạn có muốn lưu lại đôi dòng suy ngẫm không?
            </ItemDescription>
          </ItemContent>
          <ItemActions className="max-md:basis-full">
            <Button className="mx-auto" variant="link">
              Ghi dòng suy nghĩ <ArrowRight />
            </Button>
          </ItemActions>
        </Item>
      </DialogContent>
    </Dialog>
  );
}
