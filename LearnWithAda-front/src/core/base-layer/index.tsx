import React from 'react';
import classnames from 'classnames';
import './base-layer.less';
import { BaseLayerProps } from '../../utils/interfaces';

export enum DefaultThemeShadow {
    shadow1 = 'shadow-1',
    shadow2 = 'shadow-2',
    shadow3 = 'shadow-3',
}

export const BaseLayer: React.FC<BaseLayerProps> = props => {
    const { children, className = '', shadow, head = null, ...rest } = props;
    const classes = classnames({
        'base-layer': true,
        [`base-layer-${shadow}`]: shadow,
        [className]: className,
    });
    return (
        <div className={classes} {...rest}>
            <div className="base-layer-head">{head}</div>
            <div className="base-layer-content">{children}</div>
        </div>
    );
};

export default BaseLayer;
