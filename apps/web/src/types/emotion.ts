import { JSX, SVGProps } from "react";

export interface BaseEmotion {
  name: string;
  code: string;
  position: number;
}

export interface IntensityEmotion extends BaseEmotion {
  belongWith: string;
}

export interface PrimaryEmotion extends BaseEmotion {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  intensities: [IntensityEmotion, IntensityEmotion];
  color: string;
}

export interface ComposedEmotion extends BaseEmotion {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  color: string;
}

export interface GeneralEmotion
  extends
    BaseEmotion,
    Partial<Pick<PrimaryEmotion, "Icon" | "intensities" | "color">>,
    Partial<Pick<IntensityEmotion, "belongWith">> {}
