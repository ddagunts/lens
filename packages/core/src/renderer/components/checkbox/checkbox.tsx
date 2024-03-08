/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./checkbox.scss";
import React from "react";
import type { StrictReactNode } from "@openlens/utilities";
import { cssNames, noop } from "@openlens/utilities";

export interface CheckboxProps {
  className?: string;
  label?: StrictReactNode;
  inline?: boolean;
  disabled?: boolean;
  value?: boolean;
  onChange?(value: boolean, evt: React.ChangeEvent<HTMLInputElement>): void;
  children?: StrictReactNode;
}

export function Checkbox({ label, inline, className, value, children, onChange = noop, disabled, ...inputProps }: CheckboxProps) {
  const componentClass = cssNames("Checkbox flex align-center", className, {
    inline,
    checked: value,
    disabled,
  });

  return (
    <label className={componentClass}>
      <input
        {...inputProps}
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={event => onChange(event.target.checked, event)}
      />
      <i className="box flex align-center"/>
      {label ? <span className="label">{label}</span> : null}
      {children}
    </label>
  );
}
