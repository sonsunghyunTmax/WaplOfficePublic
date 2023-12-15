import React from 'react';
import classNames from 'classnames';
import ButtonBaseComponent, { ButtonBaseProps } from 'components/control/ButtonBaseComponent';
import styles from 'style/control/Label02.module.scss';
import 'style/control/Label02.scss';

type Label02Props = Omit<ButtonBaseProps, 'label'> & {
  /**
   * 텍스트가 없는 버튼의 목적 명시 (접근성 개선)
   */
  label: string;
  img: string;
  width?: string;
  height?: string;
};

const Label02Component = ({
  label,
  className,
  img,
  width = '24px',
  height = '24px',
  ...props
}: Label02Props): JSX.Element => {
  return (
    <ButtonBaseComponent
      label={label}
      className={classNames(styles.label02, { [`${className}`]: className })}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <ButtonBaseComponent.Icon id={img} w={width} h={height} />
    </ButtonBaseComponent>
  );
};

Label02Component.defaultProps = {
  width: '24px',
  height: '24px',
};

export default Label02Component;
