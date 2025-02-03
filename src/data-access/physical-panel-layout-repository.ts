import { PhysicalPanelLayout } from '../model/interfaces/physical-panel-layout'
import { InputType, PanelType, SkaarhojModel } from '../model/enums/panel-enums'

const SKAARHOJ_MKT1A_LAYOUT: PhysicalPanelLayout = {
  type: PanelType.SKAARHOJ,
  model: SkaarhojModel.MKT1A,
  inputs: {
    // Left vertical button rows - divided into four rows with two buttons on each.
    'HWC#1': InputType.BUTTON_WITH_DISPLAY,
    'HWC#2': InputType.BUTTON_WITH_DISPLAY,
    'HWC#3': InputType.BUTTON_WITH_DISPLAY,
    'HWC#4': InputType.BUTTON_WITH_DISPLAY,
    'HWC#5': InputType.BUTTON_WITH_DISPLAY,
    'HWC#6': InputType.BUTTON_WITH_DISPLAY,
    'HWC#7': InputType.BUTTON_WITH_DISPLAY,
    'HWC#8': InputType.BUTTON_WITH_DISPLAY,

    // Right lower button row
    'HWC#9': InputType.BUTTON,
    'HWC#10': InputType.BUTTON,
    'HWC#11': InputType.BUTTON,

    // Right button section - divided into three rows with four buttons on each row.
    'HWC#12': InputType.BUTTON,
    'HWC#13': InputType.BUTTON,
    'HWC#14': InputType.BUTTON,
    'HWC#15': InputType.BUTTON,
    'HWC#16': InputType.BUTTON,
    'HWC#17': InputType.BUTTON,
    'HWC#18': InputType.BUTTON,
    'HWC#19': InputType.BUTTON,
    'HWC#20': InputType.BUTTON,
    'HWC#21': InputType.BUTTON,
    'HWC#22': InputType.BUTTON,
    'HWC#23': InputType.BUTTON,

    // Upper right display section. Note: Some displays overlap
    'HWC#24': InputType.DISPLAY, // Fills up the entire horizontal section and upper vertical section, aka. Title field
    'HWC#25': InputType.DISPLAY, // Fills up the 1st quarter of the horizontal section and the entire vertical section.
    'HWC#26': InputType.DISPLAY, // Fills up the 2nd quarter of the horizontal section and the entire vertical section.
    'HWC#27': InputType.DISPLAY, // Fills up the 3rd quarter of the horizontal section and the entire vertical section.
    'HWC#28': InputType.DISPLAY, // Fills up the 4th quarter of the horizontal section and the entire vertical section.

    // Upper right display section continued.
    'HWC#29': InputType.DISPLAY, // Fills up the 1st quarter of the horizontal section and the lower vertical section.
    'HWC#30': InputType.DISPLAY, // Fills up the 2nd quarter of the horizontal section and the lower vertical section.
    'HWC#31': InputType.DISPLAY, // Fills up the 3rd quarter of the horizontal section and the lower vertical section.
    'HWC#32': InputType.DISPLAY, // Fills up the 4th quarter of the horizontal section and the lower vertical section.
    'HWC#33': InputType.DISPLAY, // Fills up the 1st quarter of the horizontal section and the upper vertical section.
    'HWC#34': InputType.DISPLAY, // Fills up the 1st quarter of the horizontal section and the upper vertical section.
    'HWC#35': InputType.DISPLAY, // Fills up the 1st quarter of the horizontal section and the upper vertical section.
    'HWC#36': InputType.DISPLAY, // Fills up the 1st quarter of the horizontal section and the upper vertical section.

    // Lower right display section: Note some displays overlap
    'HWC#37': InputType.DISPLAY, // Fills up the entire horizontal section and upper vertical section, aka. Title field
    'HWC#38': InputType.DISPLAY, // Fills the 1st third of the horizontal section and the lower vertical section.
    'HWC#39': InputType.DISPLAY, // Fills the 2nd third of the horizontal section and the lower vertical section.
    'HWC#40': InputType.DISPLAY, // Fills the 3rd third of the horizontal section and the lower vertical section.
    'HWC#41': InputType.DISPLAY, // Fills the 1st quarter of the horizontal section and the upper vertical section.
    'HWC#42': InputType.DISPLAY, // Fills the 2ns quarter of the horizontal section and the upper vertical section.
    'HWC#43': InputType.DISPLAY, // Fills the 3rd quarter of the horizontal section and the upper vertical section.
    'HWC#44': InputType.DISPLAY, // Fills the 4th quarter of the horizontal section and the upper vertical section.

    'HWC#45': InputType.LED_DISPLAY, // LED-bar display for T-bar
    'HWC#46': InputType.FADER, // T-bar

    // Lower middle display section: Note some displays overlap
    'HWC#47': InputType.DISPLAY, // Fills up the entire horizontal section and upper vertical section, aka. Title field
    'HWC#48': InputType.DISPLAY, // Fills up the 1st half of the horizontal section and the lower vertical section.
    'HWC#49': InputType.DISPLAY, // Fills up the 2nd half of the horizontal section and the lower vertical section.
    'HWC#50': InputType.DISPLAY, // Fills up the 1st quarter of the horizontal section and the lower vertical section.
    'HWC#51': InputType.DISPLAY, // Fills up the 2nd quarter of the horizontal section and the lower vertical section.
    'HWC#52': InputType.DISPLAY, // Fills up the 3rd quarter of the horizontal section and the lower vertical section.
    'HWC#53': InputType.DISPLAY, // Fills up the 4th quarter of the horizontal section and the lower vertical section.
  },
}

const SKAARHOJ_MK48_LAYOUT: PhysicalPanelLayout = {
  type: PanelType.SKAARHOJ,
  model: SkaarhojModel.MK48,
  inputs: {
    // Lowest button row - spanning the entire horizontal area of the panel.
    'HWC#1': InputType.BUTTON,
    'HWC#2': InputType.BUTTON,
    'HWC#3': InputType.BUTTON,
    'HWC#4': InputType.BUTTON,
    'HWC#5': InputType.BUTTON,
    'HWC#6': InputType.BUTTON,
    'HWC#7': InputType.BUTTON,
    'HWC#8': InputType.BUTTON,
    'HWC#9': InputType.BUTTON,
    'HWC#10': InputType.BUTTON,
    'HWC#11': InputType.BUTTON,
    'HWC#12': InputType.BUTTON,

    // Second-lowest button row - spanning the entire horizontal area of the panel.
    'HWC#13': InputType.BUTTON,
    'HWC#14': InputType.BUTTON,
    'HWC#15': InputType.BUTTON,
    'HWC#16': InputType.BUTTON,
    'HWC#17': InputType.BUTTON,
    'HWC#18': InputType.BUTTON,
    'HWC#19': InputType.BUTTON,
    'HWC#20': InputType.BUTTON,
    'HWC#21': InputType.BUTTON,
    'HWC#22': InputType.BUTTON,
    'HWC#23': InputType.BUTTON,
    'HWC#24': InputType.BUTTON,

    // Second-highest button row - spanning the entire horizontal area of the panel.
    'HWC#25': InputType.BUTTON,
    'HWC#26': InputType.BUTTON,
    'HWC#27': InputType.BUTTON,
    'HWC#28': InputType.BUTTON,
    'HWC#29': InputType.BUTTON,
    'HWC#30': InputType.BUTTON,
    'HWC#31': InputType.BUTTON,
    'HWC#32': InputType.BUTTON,
    'HWC#33': InputType.BUTTON,
    'HWC#34': InputType.BUTTON,
    'HWC#35': InputType.BUTTON,
    'HWC#36': InputType.BUTTON,

    // Highest button row - spanning the entire horizontal area of the panel
    'HWC#37': InputType.BUTTON_WITH_DISPLAY,
    'HWC#38': InputType.BUTTON_WITH_DISPLAY,
    'HWC#39': InputType.BUTTON_WITH_DISPLAY,
    'HWC#40': InputType.BUTTON_WITH_DISPLAY,
    'HWC#41': InputType.BUTTON_WITH_DISPLAY,
    'HWC#42': InputType.BUTTON_WITH_DISPLAY,
    'HWC#43': InputType.BUTTON_WITH_DISPLAY,
    'HWC#44': InputType.BUTTON_WITH_DISPLAY,
    'HWC#45': InputType.BUTTON_WITH_DISPLAY,
    'HWC#46': InputType.BUTTON_WITH_DISPLAY,
    'HWC#47': InputType.BUTTON_WITH_DISPLAY,
    'HWC#48': InputType.BUTTON_WITH_DISPLAY,

    // LED-display row above the second-lowest button row - spanning the entire horizontal area of the panel.
    'HWC#49': InputType.LED_DISPLAY,
    'HWC#50': InputType.LED_DISPLAY,
    'HWC#51': InputType.LED_DISPLAY,
    'HWC#52': InputType.LED_DISPLAY,
    'HWC#53': InputType.LED_DISPLAY,
    'HWC#54': InputType.LED_DISPLAY,
    'HWC#55': InputType.LED_DISPLAY,
    'HWC#56': InputType.LED_DISPLAY,
    'HWC#57': InputType.LED_DISPLAY,
    'HWC#58': InputType.LED_DISPLAY,
    'HWC#59': InputType.LED_DISPLAY,
    'HWC#60': InputType.LED_DISPLAY,

    // Left display group. Is above the LED-display row - spanning the 1st third horizontal section of the panel.
    'HWC#61': InputType.DISPLAY, // Spans the entire horizontal section and the upper vertical section of the group, aka. it's the Title
    'HWC#64': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the entire vertical section.
    'HWC#65': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the entire vertical section.
    'HWC#66': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the entire vertical section.
    'HWC#67': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the entire vertical section.

    // Left display group continued.
    'HWC#76': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the lower vertical section.
    'HWC#77': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the lower vertical section.
    'HWC#78': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the lower vertical section.
    'HWC#79': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the lower vertical section.
    'HWC#88': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the upper vertical section
    'HWC#89': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the upper vertical section
    'HWC#90': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the upper vertical section
    'HWC#91': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the upper vertical section

    // Middle display group. Is above the LED-display row - spanning the 2nd third horizontal section of the panel.
    'HWC#62': InputType.DISPLAY, // Spans the entire horizontal section and the upper vertical section of the group, aka. it's the Title
    'HWC#68': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the entire vertical section.
    'HWC#69': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the entire vertical section.
    'HWC#70': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the entire vertical section.
    'HWC#71': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the entire vertical section.

    // Middle display group continued.
    'HWC#80': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the lower vertical section.
    'HWC#81': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the lower vertical section.
    'HWC#82': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the lower vertical section.
    'HWC#83': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the lower vertical section.
    'HWC#92': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the upper vertical section
    'HWC#93': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the upper vertical section
    'HWC#94': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the upper vertical section
    'HWC#95': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the upper vertical section

    // Right display group. Is above the LED-display row - spanning the 3rd third horizontal section of the panel.
    'HWC#63': InputType.DISPLAY, // Spans the entire horizontal section and the upper vertical section of the group, aka. it's the Title
    'HWC#72': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the entire vertical section.
    'HWC#73': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the entire vertical section.
    'HWC#74': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the entire vertical section.
    'HWC#75': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the entire vertical section.

    // Right display group continued.
    'HWC#84': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the lower vertical section.
    'HWC#85': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the lower vertical section.
    'HWC#86': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the lower vertical section.
    'HWC#87': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the lower vertical section.
    'HWC#96': InputType.DISPLAY, // Spans the 1st quarter horizontal section and the upper vertical section
    'HWC#97': InputType.DISPLAY, // Spans the 2nd quarter horizontal section and the upper vertical section
    'HWC#98': InputType.DISPLAY, // Spans the 3rd quarter horizontal section and the upper vertical section
    'HWC#99': InputType.DISPLAY, // Spans the 4th quarter horizontal section and the upper vertical section
  },
}

export class PhysicalPanelLayoutRepository {
  public getPhysicalPanelLayouts(): PhysicalPanelLayout[] {
    return [SKAARHOJ_MKT1A_LAYOUT, SKAARHOJ_MK48_LAYOUT]
  }
}
