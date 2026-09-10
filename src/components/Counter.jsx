import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';

import './Counter.css';

const ANIMATION_DURATION = 0.7;

function RollingDigit({ mv, number, height, place }) {
  const y = useTransform(mv, (latest) => {
    if (!Number.isFinite(latest) || !Number.isFinite(place) || place === 0) {
      return 0;
    }

    const valueRoundedToPlace = getValueRoundedToPlace(latest, place);
    const placeValue = valueRoundedToPlace % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return Number.isFinite(memo) ? memo : 0;
  });

  return (
    <motion.span className="counter-number" style={{ y }}>
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num) {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function toNumericAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value
      .replace(/[^\d,.-]/g, '')
      .replace(/\.(?=.*[.,])/g, '')
      .replace(',', '.');
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getValueRoundedToPlace(value, place) {
  if (!Number.isFinite(place) || place === 0) {
    return 0;
  }

  const scaled = value / place;
  const rounded = Math.floor(normalizeNearInteger(scaled));
  return Number.isFinite(rounded) ? rounded : 0;
}

function integerDigitCount(value) {
  return Math.max(1, Math.floor(Math.abs(Number(value) || 0)).toString().length);
}

function Digit({ place, amountMV, height, digitStyle, decimalSeparator, thousandSeparator }) {
  const isDecimal = place === '.';
  const isThousand = place === ',';

  if (isDecimal || isThousand) {
    return (
      <span className="counter-digit counter-separator" style={{ height, ...digitStyle, width: 'fit-content' }}>
        {isThousand ? thousandSeparator : decimalSeparator}
      </span>
    );
  }

  return (
    <span className="counter-digit" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <RollingDigit key={i} mv={amountMV} number={i} height={height} place={place} />
      ))}
    </span>
  );
}

function insertThousandMarkers(integerPlaces) {
  const result = [];
  const count = integerPlaces.length;

  integerPlaces.forEach((place, index) => {
    result.push(place);
    const digitsFromRight = count - index - 1;
    if (digitsFromRight > 0 && digitsFromRight % 3 === 0) {
      result.push(',');
    }
  });

  return result;
}

function getPlacesFromValue(value, fractionDigits = 0, useGrouping = false) {
  const amount = Math.abs(Number(value) || 0);
  const integerDigits = integerDigitCount(amount);
  const integerPlaces = Array.from(
    { length: integerDigits },
    (_, i) => 10 ** (integerDigits - i - 1)
  );
  const groupedPlaces = useGrouping
    ? insertThousandMarkers(integerPlaces)
    : integerPlaces;

  if (fractionDigits <= 0) {
    return groupedPlaces;
  }

  const fractionPlaces = Array.from(
    { length: fractionDigits },
    (_, i) => 10 ** -(i + 1)
  );

  return [...groupedPlaces, '.', ...fractionPlaces];
}

function resolveStartValue(value, fromValue, fractionDigits) {
  if (fromValue == null || fromValue === '') {
    return value;
  }

  const numericFrom = Number(toNumericAmount(fromValue).toFixed(fractionDigits));
  return Number.isFinite(numericFrom) ? numericFrom : value;
}

export default function Counter({
  value,
  fromValue,
  fontSize = 100,
  padding = 0,
  places,
  fractionDigits = 0,
  decimalSeparator = '.',
  thousandSeparator = '',
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 0,
  gradientFrom = 'black',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle
}) {
  const height = fontSize + padding;
  const numericValue = Number(toNumericAmount(value).toFixed(fractionDigits));
  const startValue = resolveStartValue(numericValue, fromValue, fractionDigits);
  const amountMV = useMotionValue(startValue);
  const [placesSource, setPlacesSource] = useState(
    Math.max(Math.abs(startValue), Math.abs(numericValue))
  );
  const digitPlaces = places ?? getPlacesFromValue(
    placesSource,
    fractionDigits,
    Boolean(thousandSeparator)
  );
  const defaultCounterStyle = {
    fontSize,
    gap: gap,
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    color: textColor,
    fontWeight: fontWeight,
    direction: 'ltr'
  };
  const defaultTopGradientStyle = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
  };
  const defaultBottomGradientStyle = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`
  };

  useMotionValueEvent(amountMV, 'change', (latest) => {
    const next = Math.abs(latest);
    setPlacesSource((previous) => (
      integerDigitCount(previous) === integerDigitCount(next) ? previous : next
    ));
  });

  useEffect(() => {
    if (amountMV.get() === numericValue) {
      return undefined;
    }

    const controls = animate(amountMV, numericValue, {
      duration: ANIMATION_DURATION,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [amountMV, numericValue]);

  return (
    <span className="counter-container" style={containerStyle}>
      <span className="counter-counter" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {digitPlaces.map((place, index) => (
          <Digit
            key={`${place}-${index}`}
            place={place}
            amountMV={amountMV}
            height={height}
            digitStyle={digitStyle}
            decimalSeparator={decimalSeparator}
            thousandSeparator={thousandSeparator}
          />
        ))}
      </span>
      <span className="gradient-container">
        <span className="top-gradient" style={topGradientStyle ? topGradientStyle : defaultTopGradientStyle}></span>
        <span
          className="bottom-gradient"
          style={bottomGradientStyle ? bottomGradientStyle : defaultBottomGradientStyle}
        ></span>
      </span>
    </span>
  );
}
