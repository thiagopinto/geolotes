import { Control } from "ol/control";

interface DrawControlProps {
  onToggle: () => void;
  initialActive: boolean; // Prop para o estado inicial
}

class DrawControl extends Control {
  button: HTMLButtonElement;
  active: boolean;

  constructor(props: DrawControlProps) {
    super({
      element: document.createElement("div"),
    });
    this.element.className = "ol-unselectable ol-control";
    this.element.style.top = "5em";
    this.element.style.left = "0.5em";
    this.button = document.createElement("button");
    this.active = props.initialActive; // Usa a prop ou define como false
    this.button.innerHTML = this.active ? "🚫" : "✏️"; // Texto inicial correto
    this.element.appendChild(this.button);

    this.button.addEventListener("click", () => {
      this.active = !this.active;
      this.button.innerHTML = this.active ? "🚫" : "✏️";
      props.onToggle();
    });
  }

  setActive(active: boolean) {
    this.active = active;
    this.button.innerHTML = this.active ? "🚫" : "✏️";
  }
}

export default DrawControl;