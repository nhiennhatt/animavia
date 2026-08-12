import { getCoordinatesForAngle, getPiecePath } from "@/helpers/emotion";
import { cn } from "@/lib/utils";
import { PrimaryEmotion } from "@/types/emotion";

export interface PrimaryEmotionPieceProps {
  emotion: PrimaryEmotion;
  isSelected: boolean;
  onClick: (emotion: PrimaryEmotion) => void;
  pieceAngle: number;
  wheelAmount: number;
}

export function PrimaryEmotionPiece({
  emotion,
  onClick,
  pieceAngle,
  isSelected,
  wheelAmount,
}: PrimaryEmotionPieceProps) {
  const position = emotion.position - 1;
  const midEdge = pieceAngle * (position + 0.5);
  const [tx, ty] = getCoordinatesForAngle(midEdge, 25);
  const isObtuse = position % 2 === 0;
  const isRightPosition = position <= wheelAmount / 2;
  const startAngle = position * pieceAngle;
  const endAngle = startAngle + pieceAngle;

  return (
    <g data-active={isSelected}>
      <path
        onClick={() => {
          onClick(emotion);
        }}
        d={getPiecePath(startAngle, endAngle, 0, 50)}
        className={cn("outline-none")}
        fill={emotion.color}
      />
      <g transform={`translate(${tx}, ${ty}) rotate(${pieceAngle / 2})`}>
        <emotion.Icon
          x={isObtuse ? -2 : isRightPosition ? 0 : -4}
          y="-4"
          width="4"
          height="4"
          pointerEvents="none"
          fill="white"
        />
        <text
          pointerEvents="none"
          textAnchor="middle"
          fill="white"
          dominantBaseline="middle"
          className="text-[3.5px]"
          x={isObtuse ? 0 : isRightPosition ? 2 : -2}
          y="2.5"
        >
          {emotion.name}
        </text>
      </g>
    </g>
  );
}
