import { GeneralEmotion } from "@/types/emotion";

export function checkIsSelected(
  emotion: GeneralEmotion,
  choiceEmotion: GeneralEmotion | null,
) {
  if (choiceEmotion === null) return false;
  return !!(
    emotion.code === choiceEmotion.code ||
    emotion.belongWith === choiceEmotion.code
  );
}

export function getCoordinatesForAngle(angle: number, radius: number) {
  const x = 50 + radius * Math.cos(((angle - 90) * Math.PI) / 180);
  const y = 50 + radius * Math.sin(((angle - 90) * Math.PI) / 180);
  return [x, y];
}

export function getPiecePath(
  sangle: number,
  eangle: number,
  innerRadius: number,
  outerRadius: number,
) {
  const [sox, soy] = getCoordinatesForAngle(sangle, outerRadius);
  const [eox, eoy] = getCoordinatesForAngle(eangle, outerRadius);

  const [six, siy] = getCoordinatesForAngle(sangle, innerRadius);
  const [eix, eiy] = getCoordinatesForAngle(eangle, innerRadius);

  return [
    `M ${six} ${siy}`,
    `L ${sox} ${soy}`,
    `A ${outerRadius} ${outerRadius} 0 0 1 ${eox} ${eoy}`,
    `L ${eix} ${eiy}`,
    `A ${innerRadius} ${innerRadius} 0 0 0 ${six} ${siy}`,
    `Z`,
  ].join(" ");
}
