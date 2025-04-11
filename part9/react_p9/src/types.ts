interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescribed extends CoursePartBase {
  description: string;
}

interface CoursePartSpecial extends CoursePartDescribed {
  kind: "special";
  requirements: string[];
}

interface CoursePartBasic extends CoursePartDescribed {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescribed {
  backgroundMaterial: string;
  kind: "background";
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

export interface CourseNameProps {
  name: string;
}

export interface ContentProps {
  courseParts: CoursePart[];
}
export interface CourseTotalExerciseProps {
  totalExerciseCount: number;
}
