import mapboxgl from "mapbox-gl";

export default class ClickableMarker extends mapboxgl.Marker {
  private _onClick?: () => void;

  onClick(handler: () => void): this {
    this._onClick = handler;
    const element = this.getElement();
    
    element.style.cursor = "pointer";
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this._onClick) {
        this._onClick();
      }
    });

    return this;
  }
}