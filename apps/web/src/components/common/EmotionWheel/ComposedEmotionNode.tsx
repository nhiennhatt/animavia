import { getCoordinatesForAngle } from "@/helpers/emotion";
import { ComposedEmotion } from "@/types/emotion";

export interface ComposedEmotionNodeProps {
  emotion: ComposedEmotion;
  isSelected: boolean;
  onClick: (emotion: ComposedEmotion) => void;
  pieceAngle: number;
}

export function ComposedEmotionNode({
  emotion,
  isSelected,
  onClick,
  pieceAngle,
}: ComposedEmotionNodeProps) {
  const position = emotion.position - 1;
  const currentEdge = pieceAngle * (position + 1);
  const [btnx, btny] = getCoordinatesForAngle(currentEdge, 40);
  
  return (
    <g className="not-data-active:[&_svg]:brightness-0 data-active:[&_svg]:brightness-90" data-active={isSelected}>
      <circle
        transform={`translate(${btnx}, ${btny})`}
        className="stroke-white stroke-[0.5] fill-neutral-100 hover:fill-accent data-active:fill-accent"
        strokeWidth={0.1}
        r="7"
        onClick={() => onClick(emotion)}
      />
      <g
        transform={`translate(${btnx - 2.5}, ${btny - 2.5}) rotate(${pieceAngle / 2}, 2.5, 2.5)`}
      >
        <emotion.Icon fill={emotion.color} pointerEvents="none" width="5" height="5" />
      </g>
    </g>
  );
}
