import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

export const applyLeafletIconFix = () => {
const DefaultIcon = L.icon({ iconUrl, iconRetinaUrl, shadowUrl });
L.Marker.prototype.options.icon = DefaultIcon;
};