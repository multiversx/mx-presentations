import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { styles } from './Button.styles';

interface IButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  label: string;
  variant?: BUTTON_VARIANTS;
  color?: string;
  textColor?: string;
}

export enum BUTTON_VARIANTS {
  LINK = 'LINK',
  OUTLINED = 'OUTLINED'
}

const mapStylesByVariant = (variant?: BUTTON_VARIANTS) => {
  switch (variant) {
    case BUTTON_VARIANTS.LINK:
      return styles.linkContainer;
    case BUTTON_VARIANTS.OUTLINED:
      return styles.outlinedContainer;

    default:
      return styles.filledContainer;
  }
};

const applyDisabledStyles = (disabled?: boolean) => ({
  opacity: disabled ? 0.6 : 1
});

const getTextColor = (variant?: BUTTON_VARIANTS) =>
  variant ? '#007AFF' : '#fff';

const Button: React.FC<IButtonProps> = ({
  label,
  variant,
  disabled,
  ...rest
}) => (
  <TouchableOpacity
    testID='custom-button'
    style={{ ...mapStylesByVariant(variant), ...applyDisabledStyles(disabled) }}
    activeOpacity={0.8}
    disabled={disabled}
    {...rest}>
    <Text style={{ ...styles.buttonText, color: getTextColor(variant) }}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default Button;
