import React from 'react';

import {classNames} from '../../utilities/css';
import type {Action, Error} from '../../types';
import {buttonFrom} from '../Button';
import {Label, labelID} from '../Label';
import type {LabelProps} from '../Label';
import {InlineError} from '../InlineError';
import {Text} from '../Text';

import styles from './Labelled.module.scss';

export {labelID};

export interface LabelledProps {
  /** A unique identifier for the label */
  id: LabelProps['id'];
  /** Text for the label */
  label: React.ReactNode;
  /** Error to display beneath the label */
  error?: Error | boolean;
  /** An action */
  action?: Action;
  /** Additional hint text to display */
  helpText?: React.ReactNode;
  /** Content to display inside the connected */
  children?: React.ReactNode;
  /** Visually hide the label */
  labelHidden?: boolean;
  /** Visual required indicator for the label */
  requiredIndicator?: boolean;
  /** Labels signify a disabled control */
  disabled?: boolean;
  /** Labels signify a readOnly control */
  readOnly?: boolean;
}

export function Labelled({
  id,
  label,
  error,
  action,
  helpText,
  children,
  labelHidden,
  requiredIndicator,
  disabled,
  readOnly,
  ...rest
}: LabelledProps) {
  const className = classNames(
    labelHidden && styles.hidden,
    disabled && styles.disabled,
    readOnly && styles.readOnly,
  );

  const actionMarkup = action ? (
    <div className={styles.Action}>
      {buttonFrom(action, {variant: 'plain'})}
    </div>
  ) : null;

  const helpTextMarkup = helpText ? (
    <div
      className={styles.HelpText}
      id={helpTextID(id)}
      aria-disabled={disabled}
    >
      <Text as="span" tone="subdued" breakWord>
        {helpText}
      </Text>
    </div>
  ) : null;

  const errorMarkup = error && typeof error !== 'boolean' && (
    <div className={styles.Error}>
      <InlineError message={error} fieldID={id} />
    </div>
  );

  const labelMarkup = label ? (
    <div className={styles.LabelWrapper}>
      <Label
        id={id}
        requiredIndicator={requiredIndicator}
        {...rest}
        hidden={false}
      >
        {label}
      </Label>

      {actionMarkup}
    </div>
  ) : null;

  return (
    <div className={className}>
      {labelMarkup}
      {children}
      {errorMarkup}
      {helpTextMarkup}
    </div>
  );
}

export function errorID(id: string) {
  return `${id}Error`;
}

export function helpTextID(id: string) {
  return `${id}HelpText`;
}
