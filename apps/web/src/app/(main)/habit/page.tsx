import { ProtectedComponent } from "@/components/common/ProtectedComponent";
import { Habits } from "@/modules/habit/habit/Habits";

export default function HabitPage() {
  return (
    <ProtectedComponent isSignInRedirect={false}>
      <Habits />
    </ProtectedComponent>
  );
}
