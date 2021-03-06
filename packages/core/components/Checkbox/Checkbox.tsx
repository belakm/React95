import * as React from 'react';
import styled, { css } from '@xstyled/styled-components';

import check from '../shared/assets/pattern/check.svg';
import checkDisabled from '../shared/assets/pattern/check-disabled.svg';
import bgpattern from '../shared/assets/pattern/dropdown.png';
import { border } from '../shared-style/Border';

const Icon = styled.span`
  ${border({ direction: 'intrude' })}
  width: 12px;
  height: 12px;
  left: 0;
  display: inline-block;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.canvas};
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 7px 7px;
  margin-top: 2px;
`;

const Text = styled.span`
  padding: 1;
  user-select: none;
`;

const Field = styled.input.attrs({
  type: 'checkbox',
})`
  width: 12px;
  height: 12px;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &:focus ~ ${Text}, &:active ~ ${Text} {
    border-width: 1;
    border-style: dotted;
    padding: 0;
  }
  &:disabled {
    color: ${({ theme }) => theme.colors.canvasTextDisabled};
  }
  &:checked + ${Icon} {
    background-image: url('${check}');
  }
  &:checked &:disabled + ${Icon} {
    background-image: url('${checkDisabled}'), url('${bgpattern}');
    background-size: 7px 7px, 2px 2px;
  }
  &:disabled + ${Icon} {
    background-color: ${({ theme }) => theme.colors.borderLight};
  }
`;

Field.displayName = 'Field';

export type LabelProps = {
  disabled?: boolean;
};

const Label = styled.label<LabelProps>`
  display: inline-block;
  height: 15px;
  line-height: 1.5;
  position: relative;
  margin: 4px 0px;
  padding-left: 20px;
  ${({ disabled }) =>
    disabled &&
    css`
      color: ${({ theme }) => theme.colors.canvasText};
      text-shadow: 0.5px 0.5px ${({ theme }) => theme.colors.borderLight};
    `}
`;

export type CheckboxProps = {
  label?: string;
  children?: string;
  checked?: boolean;
  style?: React.CSSProperties;
} & LabelProps &
  React.HTMLAttributes<HTMLInputElement>;

const emptyFn = () => {};
const Checkbox: React.FC<CheckboxProps> = ({
  children,
  style,
  checked,
  label,
  disabled = false,
  onChange = emptyFn,
  ...rest
}) => (
  <Label style={style} disabled={disabled}>
    <Field
      onChange={onChange}
      checked={checked}
      disabled={disabled}
      {...rest}
    />
    <Icon />
    <Text>{children || label}</Text>
  </Label>
);

export default Checkbox;
