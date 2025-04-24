import { Interactable } from "./interactable";

export type Interactor = {
  interact: (interactable: Interactable) => void;
};
