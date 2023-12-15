import React from 'react';
import classNames from 'classnames';
import ButtonBaseComponent, { ButtonBaseProps } from 'components/control/ButtonBaseComponent';
import styles from 'style/control/Label01.module.scss';
import 'style/widgets/label/Label01.scss';

type Label01Props = Omit<ButtonBaseProps, 'label'> & {
  label: string;
};
/**
 * TOC Common Control > Label01
 */
const Label01Component = ({ label, className, ...props }: Label01Props): JSX.Element => {
  return (
    <ButtonBaseComponent
      className={classNames(styles.label01, { [`${className}`]: className })}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <span className={styles.label}>
        <ButtonBaseComponent.Text id={label} />
      </span>
    </ButtonBaseComponent>
  );
};

export default Label01Component;
