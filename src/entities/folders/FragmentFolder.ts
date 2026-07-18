import type { Fragment } from "../fragments/Fragment";
import type { Folder } from "./Folder";

export interface FragmentFolder extends Folder {
  projectId: string;
  fragments: Fragment[];
}