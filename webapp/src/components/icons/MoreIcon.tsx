import React from 'react'
import IconProps from "./IconProps";

const MoreIcon = (props: IconProps) => (
  <svg
    className="prefix__icon"
    viewBox="0 0 1024 1024"
    width={props.width || 24}
    height={props.height || 24}>
    <defs>
      <style />
    </defs>
    <path
      d="M400 848c0-61.9 49.7-112 112-112 61.9 0 112 49.7 112 112 0 61.9-49.7 112-112 112-61.9 0-112-49.7-112-112zm0-336c0-61.9 49.7-112 112-112 61.9 0 112 49.7 112 112 0 61.9-49.7 112-112 112-61.9 0-112-49.7-112-112zm0-336c0-61.9 49.7-112 112-112 61.9 0 112 49.7 112 112 0 61.9-49.7 112-112 112-61.9 0-112-49.7-112-112z"
      fill={props.fill}
    />
  </svg>
)

export default MoreIcon
