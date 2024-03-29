export interface IDrawSettings {
  id: number;
  active?: boolean;
  event?: () => void;
  icon?: any;
}

export interface IDrawUi extends IDrawSettings {
  src: string;
}

export interface ISettingsUiDraw {
  color: Ref<string>;
  lineWidth: Ref<number>;
}
