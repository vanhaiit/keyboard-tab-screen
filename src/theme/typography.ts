const lineHeightFactor = {
  130: 1.3,
  150: 1.5,
  180: 1.8,
};

export const typography = {
  h1: {
    fontSize: 25,
    lineHeight: 25 * lineHeightFactor[130],
  },
  h2: {
    fontSize: 20,
    lineHeight: 20 * lineHeightFactor[150],
  },
  h3: {
    fontSize: 18,
    lineHeight: 18 * lineHeightFactor[150],
  },
  h4: {
    fontSize: 15,
    lineHeight: 15 * lineHeightFactor[150],
  },
  h5: {
    fontSize: 13,
    lineHeight: 13 * lineHeightFactor[150],
  },

  body1: {
    fontSize: 16,
    lineHeight: 16 * lineHeightFactor[180],
  },
  body2: {
    fontSize: 14,
    lineHeight: 14 * lineHeightFactor[150],
  },
  body3: {
    fontSize: 15,
    lineHeight: 15 * lineHeightFactor[150],
  },
  label: {
    fontSize: 12,
    lineHeight: 12 * lineHeightFactor[150],
  },
  smallLabel: {
    fontSize: 11,
    lineHeight: 16.5,
  },
  tinyLabel: {
    fontSize: 10,
    lineHeight: 12,
  },
};
