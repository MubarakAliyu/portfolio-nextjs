// Tiny toast store. toast("Copied ✓", { x, y }) pops a message at the pointer
// (floating up) or, without coordinates, at the bottom centre. <Toaster /> renders them.
const listeners = new Set();
let toasts = [];
let nextId = 1;

const emit = () => listeners.forEach((fn) => fn());

export function toast(message, { x, y, duration = 1600 } = {}) {
  const id = nextId++;
  toasts = [...toasts, { id, message, x, y }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
}

export const subscribeToasts = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const getToasts = () => toasts;

const EMPTY = [];
export const getServerToasts = () => EMPTY;
