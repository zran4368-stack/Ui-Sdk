export type BlazerAnimationPreset = "rise" | "pop" | "blaze" | "float" | "pulse";

export interface BlazerAnimationOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  easing?: string;
  fill?: FillMode;
  iterations?: number;
}

export interface BlazerToastOptions {
  title?: string;
  message?: string;
  timeout?: number;
}

export function initBlazer(root?: ParentNode | Document): void;
export function showToast(options?: BlazerToastOptions): HTMLElement | null;
export function animate(
  targets: string | Element | Element[] | NodeListOf<Element>,
  preset?: BlazerAnimationPreset,
  options?: BlazerAnimationOptions
): Array<Animation | null>;
export function openModal(modal: HTMLElement | null): void;
export function closeModal(modal: HTMLElement | null): void;
export function openCommand(command?: HTMLElement | null): void;
export function closeCommand(command?: HTMLElement | null): void;

declare global {
  interface Window {
    Blazer?: {
      init: typeof initBlazer;
      toast: typeof showToast;
      animate: typeof animate;
      openModal: typeof openModal;
      closeModal: typeof closeModal;
      openCommand: typeof openCommand;
      closeCommand: typeof closeCommand;
    };
  }
}
