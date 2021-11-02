import * as $ from "jquery";

const createAnalytics = (): object => {
  let counter: number = 0;
  let isDestroyed: boolean = false;

  const listener = (): number => counter++;

  $(document).on("click", listener);

  return {
    destroy(): void {
      $(document).off("click", listener)
      isDestroyed = true;
    },

    getClicks(): string | number {
      if (isDestroyed) {
        return `Message: Analytics is destroyed. Total clicks = ${counter}`;
      }
      return counter;
    }
  };
};

window["analytics"] = createAnalytics();