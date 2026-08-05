export function getInlineModalStyles(backdropOpacity: number) {
  return {
    backdropStyle: { opacity: backdropOpacity },
    bottomSheetStyle: { transform: [{ translateY: 0 }] },
    centerAlertStyle: {
      opacity: 1,
      transform: [{ scale: 1 }],
    },
    fullScreenStyle: {
      opacity: 1,
      transform: [{ translateY: 0 }, { scale: 1 }],
    },
  };
}
