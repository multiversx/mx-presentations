import {Palette} from "../palette";

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

import { FullTheme as DefaultTheme } from '@rneui/themed';

declare module '@rneui/themed' {
  export interface Colors extends Palette {}

  export interface FullTheme extends DefaultTheme {
    colors: RecursivePartial<Colors>;
  }
}
