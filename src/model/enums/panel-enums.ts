export enum PanelType {
  SKAARHOJ = 'SKAARHOJ',
}

export type PanelModel = SkaarhojModel

export enum SkaarhojModel {
  MK48 = 'SK_MK48',
  MKT1A = 'SK_MKT1A',
}

export enum InputType {
  BUTTON = 'BUTTON',
  BUTTON_WITH_DISPLAY = 'BUTTON_WITH_DISPLAY',
  DISPLAY = 'DISPLAY',
  LED_DISPLAY = 'LED_DISPLAY',
  FADER = 'FADER',
}

export enum InputDataType {
  HTTP_ENDPOINT = 'HTTP_ENDPOINT',
  MODIFIER = 'MODIFIER',
  T_BAR = 'T_BAR',
}
