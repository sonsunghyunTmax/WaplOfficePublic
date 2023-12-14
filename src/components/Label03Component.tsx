import React from 'react';
import classNames from 'classnames';
import ButtonBaseComponent, { ButtonBaseProps } from 'components/control/ButtonBaseComponent';
import styles from 'style/control/Label03.module.scss';

type Label03Props = Omit<ButtonBaseProps, 'label'> & {
  label: string;
  img: string;
  width?: string;
  height?: string;
};

const Label03Component = ({
  className,
  label,
  img,
  width = '16px',
  height = '16px',
  ...props
}: Label03Props): JSX.Element => {
  return (
    <ButtonBaseComponent
      className={classNames(styles.label03, { [`${className}`]: className })}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <ButtonBaseComponent.Icon id={img} w={width} h={height} />
      <span className={styles.label}>
        <ButtonBaseComponent.Text id={label} />
      </span>
    </ButtonBaseComponent>
  );
};

Label03Component.defaultProps = {
  width: '16px',
  height: '16px',
};

export default Label03Component;
