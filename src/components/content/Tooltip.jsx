import { Tooltip, OverlayTrigger } from "react-bootstrap";

const TooltipRenderer = ({ children, title, placement = "right",color = '#000000', textColor = '#ffffff' }) => (
  <OverlayTrigger
    delay={{ show: 250, hide: 400 }}
    placement={placement}
    onEntering={(e) => {
      e.children[0].style.borderTopColor = color;
      e.children[1].style.backgroundColor = color;
      e.children[1].style.color = textColor;
    }}
    overlay={(props) => (
      <Tooltip id="button-tooltip" {...props}>
        {title}
      </Tooltip>
    )}
  >
    {children}
  </OverlayTrigger>
);

export default TooltipRenderer;
