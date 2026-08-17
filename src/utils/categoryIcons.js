import {
  LayoutGrid,
  Laptop,
  Smartphone,
  MonitorPlay,
  Gamepad2,
  Headphones,
  Cable,
  Printer,
  Camera,
  Monitor,
  Cpu,
  Speaker,
  Keyboard,
  Mouse,
  HardDrive,
  Tablet,
  Watch,
  Armchair,
  Tag,
} from "lucide-react";

const CATEGORY_ICON_MAP = {
  notebook: Laptop,
  laptop: Laptop,
  celular: Smartphone,
  telefono: Smartphone,
  smartphone: Smartphone,
  televisor: MonitorPlay,
  tv: MonitorPlay,
  monitor: Monitor,
  gaming: Gamepad2,
  gamer: Gamepad2,
  juego: Gamepad2,
  consola: Gamepad2,
  auricular: Headphones,
  audio: Speaker,
  parlante: Speaker,
  cable: Cable,
  red: Cable,
  impresora: Printer,
  insumo: Printer,
  camara: Camera,
  filmacion: Camera,
  tablet: Tablet,
  procesador: Cpu,
  componente: Cpu,
  teclado: Keyboard,
  mouse: Mouse,
  disco: HardDrive,
  almacenamiento: HardDrive,
  reloj: Watch,
  silla: Armchair,
  mesa: Armchair,
  accesorio: Tag,
  tecnologia: Cpu,
  electrodomestico: Monitor,
};

export function getIconForCategory(categoryName) {
  if (!categoryName) return LayoutGrid;
  const lower = categoryName.toLowerCase();
  for (const [keyword, icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (lower.includes(keyword)) return icon;
  }
  return LayoutGrid;
}
