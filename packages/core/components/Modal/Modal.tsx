import React from 'react';
import CSS from 'csstype';
import styled, { css } from '@xstyled/styled-components';
import Draggable from 'react-draggable';

import Button, { StyledButton } from '../Button/Button';
import Icon, { IconProps } from '../Icon/Icon';
import List from '../List';
import ModalContext from './ModalContext';
import Window from '../Window';

type WrapperProps = {
  width?: CSS.Property.Width | number;
  height?: CSS.Property.Height | number;
  active?: boolean;
};

const ModalWrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.material : theme.colors.materialDark};
  ${({ active }) =>
    active
      ? css`
          z-index: ${({ theme }) => theme.zIndices.modal};
        `
      : ''}
`;

interface TitleBarProps {
  isActive?: boolean;
}
const TitleBar = styled.div<TitleBarProps>`
  height: 20px;
  padding: 1px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  background-color: ${({ isActive, theme }) =>
    isActive
      ? theme.colors.headerBackground
      : theme.colors.headerNotActiveBackground};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.headerText : theme.colors.headerNotActiveText};
`;

const Title = styled.h1`
  flex-grow: 1;
  font-weight: bold;
  line-height: 1.4em;
  margin: 0;
  font-size: 1em;
`;

const OptionsBox = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
`;

const OptionItem = styled.li`
  display: flex;
  margin-left: 2;
  &:first-child {
    margin-right: 0;
  }
`;

const Option = styled(StyledButton)`
  padding: 0;
  width: 17px;
  height: 16px;
  min-width: 0;
  font-size: 10;
  font-weight: 600;
`;

Option.displayName = 'Option';

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 2px;
`;

type ButtonWrapperProps = {
  buttonsAlignment?: CSS.Property.JustifyContent;
};

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: ${({ buttonsAlignment = 'center' }) => buttonsAlignment};

  & ${StyledButton} {
    margin-left: 6;
    min-width: 70px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const MenuWrapper = styled.ul`
  display: flex;
  flex-direction: row;
  list-style: none;
  margin: 0;
  padding-left: 0;
  padding-bottom: 3;
  padding-top: 5;
`;

const MenuItem = styled.li<Pick<WrapperProps, 'active'>>`
  position: relative;
  padding-left: 6;
  padding-right: 6;
  z-index: 1;

  user-select: none;

  ul {
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.canvasText};
  }

  ${({ active }) =>
    active &&
    css`
      background: ${({ theme }) => theme.colors.headerBackground};
      color: ${({ theme }) => theme.colors.headerText};
    `};
`;

MenuItem.displayName = 'MenuItem';

export type ModalButtons = {
  value: string;
  onClick(event: React.MouseEvent): void;
};

export type ModalMenu = {
  name: string;
  list: React.ReactElement<typeof List>;
};

export type ModalDefaultPosition = {
  x: number;
  y: number;
};

export type ModalProps = {
  icon?: IconProps['name'];
  closeModal(event: React.MouseEvent): void;
  title: string;
  buttons?: Array<ModalButtons>;
  menu?: Array<ModalMenu>;
  defaultPosition?: ModalDefaultPosition;
} & Omit<WrapperProps, 'active'> &
  ButtonWrapperProps &
  React.HTMLAttributes<HTMLDivElement>;

const ModalRenderer = (
  {
    buttons,
    buttonsAlignment,
    children,
    closeModal,
    defaultPosition,
    width,
    height,
    icon,
    menu,
    title,
    ...rest
  }: ModalProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    addWindows,
    removeWindows,
    setActiveWindow,
    activeWindow: activeWindowId,
  } = React.useContext(ModalContext);
  const [menuOpened, setMenuOpened] = React.useState('');
  const [id] = React.useState(() => Math.random().toString(16).slice(-4));

  React.useEffect(() => {
    addWindows({ icon, title, id });
  }, []);

  const iconStyle = {
    width: 15,
    height: 13,
    style: {
      marginRight: '4px',
    },
  };

  return (
    <Draggable handle=".draggable" defaultPosition={defaultPosition}>
      <ModalWrapper
        onClick={() => setActiveWindow(id)}
        active={activeWindowId === id}
        ref={ref}
        {...rest}
      >
        <Window width={width} height={height}>
          <TitleBar isActive={activeWindowId === id} className="draggable">
            {icon && <Icon name={icon} {...iconStyle} />}
            <Title>{title}</Title>
            <OptionsBox>
              <OptionItem>
                <Option>?</Option>
              </OptionItem>
              <OptionItem>
                <Option
                  onClick={event => {
                    closeModal(event);
                    removeWindows(title);
                  }}
                >
                  X
                </Option>
              </OptionItem>
            </OptionsBox>
          </TitleBar>

          {menu && menu.length > 0 && (
            <MenuWrapper>
              {menu.map(({ name, list }) => {
                const active = menuOpened === name;
                return (
                  <MenuItem
                    key={name}
                    onMouseDown={() => setMenuOpened(name)}
                    active={active}
                  >
                    {name}
                    {active && list}
                  </MenuItem>
                );
              })}
            </MenuWrapper>
          )}
          <Content onClick={() => setMenuOpened('')}>{children}</Content>
          {buttons && buttons.length > 0 && (
            <ButtonWrapper
              buttonsAlignment={buttonsAlignment}
              onClick={() => setMenuOpened('')}
            >
              {buttons.map(button => (
                <Button
                  key={button.value}
                  onClick={button.onClick}
                  value={button.value}
                >
                  {button.value}
                </Button>
              ))}
            </ButtonWrapper>
          )}
        </Window>
      </ModalWrapper>
    </Draggable>
  );
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(ModalRenderer);

Modal.displayName = 'Modal';

Modal.defaultProps = {
  icon: undefined,
  title: 'Modal',
  buttonsAlignment: 'flex-end',
  children: null,
  defaultPosition: { x: 0, y: 0 },
  buttons: [],
  menu: [],
  width: undefined,
  height: undefined,
  closeModal: () => {},
};
export default Modal;
