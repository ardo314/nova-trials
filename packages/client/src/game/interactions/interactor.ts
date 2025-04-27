import { IInteractable } from "./interactable";

export type Interactor = {
  interact: (interactable: IInteractable) => void;
};
