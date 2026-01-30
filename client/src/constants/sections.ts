// Arena section configuration for Scotiabank Arena

export interface SectionOption {
  name: string;
  code: string;
}

export interface SelectOption<T = any> {
  value: T;
  label: string;
}

export const SECTION_OPTIONS: SectionOption[] = [
  { name: "All Sections", code: '' },
  { name: "Courtside", code: '' },
  { name: "Lower Bowl", code: '' },
  { name: "Upper Bowl", code: '' },
  { name: "Lower Sideline (center court)", code: '' },
  { name: "Lower Baseline (end zone)", code: '' },
  { name: "Upper Sideline (center court)", code: '' },
  { name: "Upper Baseline (end zone)", code: '' },
  { name: "CRTN", code: 's_217' },
  { name: "CRTE", code: 's_216' },
  { name: "CRTS", code: 's_214' },
  { name: "CRTW", code: 's_215' },
  { name: "101", code: 's_41' },
  { name: "102", code: 's_25' },
  { name: "103", code: 's_46' },
  { name: "104", code: 's_43' },
  { name: "105", code: 's_208' },
  { name: "106", code: 's_38' },
  { name: "107", code: 's_30' },
  { name: "108", code: 's_24' },
  { name: "109", code: 's_31' },
  { name: "110", code: 's_40' },
  { name: "111", code: 's_36' },
  { name: "112", code: 's_44' },
  { name: "113", code: 's_27' },
  { name: "114", code: 's_26' },
  { name: "115", code: 's_42' },
  { name: "116", code: 's_127' },
  { name: "117", code: 's_38' },
  { name: "118", code: 's_29' },
  { name: "119", code: 's_33' },
  { name: "120", code: 's_28' },
  { name: "121", code: 's_37' },
  { name: "122", code: 's_45' },
  { name: "301", code: 's_218' },
  { name: "302", code: 's_203' },
  { name: "303", code: 's_201' },
  { name: "304", code: 's_202' },
  { name: "305", code: 's_49' },
  { name: "306", code: 's_135' },
  { name: "307", code: 's_145' },
  { name: "308", code: 's_197' },
  { name: "309", code: 's_194' },
  { name: "310", code: 's_196' },
  { name: "311", code: 's_142' },
  { name: "312", code: 's_133' },
  { name: "313", code: 's_50' },
  { name: "314", code: 's_56' },
  { name: "315", code: 's_200' },
  { name: "316", code: 's_55' },
  { name: "317", code: 's_48' },
  { name: "318", code: 's_131' },
  { name: "319", code: 's_149' },
  { name: "320", code: 's_198' },
  { name: "321", code: 's_195' },
  { name: "322", code: 's_199' },
  { name: "323", code: 's_152' },
  { name: "324", code: 's_129' },
];

// Section grouping mappings for filter convenience
export const SECTION_GROUPS: Record<string, string[]> = {
  "Courtside": ['s_217', 's_216', 's_214', 's_215'],
  "Lower Bowl": [
    's_41', 's_25', 's_46', 's_43', 's_208', 's_38', 's_30', 's_24',
    's_31', 's_40', 's_36', 's_44', 's_27', 's_26', 's_42', 's_127',
    's_38', 's_29', 's_33', 's_28', 's_37', 's_45'
  ],
  "Upper Bowl": [
    's_218', 's_203', 's_201', 's_202', 's_49', 's_135', 's_145',
    's_197', 's_194', 's_196', 's_142', 's_133', 's_50', 's_56',
    's_200', 's_55', 's_48', 's_131', 's_149', 's_198', 's_195',
    's_199', 's_152', 's_129'
  ],
  "Lower Baseline (end zone)": ['s_41', 's_25', 's_46', 's_43', 's_44', 's_27', 's_36', 's_42'],
  "Lower Sideline (center court)": [
    's_208', 's_38', 's_30', 's_24', 's_31', 's_40', 's_36', 
    's_127', 's_38', 's_29', 's_33', 's_28', 's_37', 's_45'
  ],
  "Upper Baseline (end zone)": [
    's_218', 's_203', 's_201', 's_202', 's_49', 's_50', 's_56', 's_200', 's_55', 's_48',
  ],
  "Upper Sideline (center court)": [
    's_135', 's_145', 's_197', 's_194', 's_196', 's_142', 's_133',
    's_131', 's_149', 's_198', 's_195', 's_199', 's_152', 's_129'
  ]
};

// Helper to convert section names to codes
export function getSectionCodes(sectionNames: string[]): string[] {
  const codes: string[] = [];
  
  for (const name of sectionNames) {
    if (name === "All Sections") {
      return SECTION_OPTIONS
        .filter(option => option.code !== '')
        .map(option => option.code);
    }
    
    if (SECTION_GROUPS[name]) {
      codes.push(...SECTION_GROUPS[name]);
    } else {
      const section = SECTION_OPTIONS.find(option => option.name === name);
      if (section?.code) {
        codes.push(section.code);
      }
    }
  }
  
  return codes;
}

export const ROW_OPTIONS: SelectOption<string>[] = [
  { value: 'All Rows', label: 'All Rows' },
  { value: 'A', label: 'Row A and below' },
  { value: 'B', label: 'Row B and below' },
  { value: 'C', label: 'Row C and below' },
  { value: 'D', label: 'Row D and below' },
  { value: 'E', label: 'Row E and below' },
  { value: 'F', label: 'Row F and below' },
  { value: 'G', label: 'Row G and below' },
  { value: 'H', label: 'Row H and below' },
  { value: '1', label: 'Row 1 and below' },
  { value: '2', label: 'Row 2 and below' },
  { value: '3', label: 'Row 3 and below' },
  { value: '4', label: 'Row 4 and below' },
  { value: '5', label: 'Row 5 and below' },
  { value: '6', label: 'Row 6 and below' },
  { value: '7', label: 'Row 7 and below' },
  { value: '8', label: 'Row 8 and below' },
  { value: '9', label: 'Row 9 and below' },
  { value: '10', label: 'Row 10 and below' },
  { value: '11', label: 'Row 11 and below' },
  { value: '12', label: 'Row 12 and below' },
  { value: '13', label: 'Row 13 and below' },
  { value: '14', label: 'Row 14 and below' },
  { value: '15', label: 'Row 15 and below' },
  { value: '16', label: 'Row 16 and below' },
  { value: '17', label: 'Row 17 and below' },
  { value: '18', label: 'Row 18 and below' },
  { value: '19', label: 'Row 19 and below' },
  { value: '20', label: 'Row 20 and below' },
  { value: '21', label: 'Row 21 and below' },
  { value: '22', label: 'Row 22 and below' },
  { value: '23', label: 'Row 23 and below' },
  { value: '24', label: 'Row 24 and below' },
  { value: '25', label: 'Row 25 and below' },
  { value: '26', label: 'Row 26 and below' },
  { value: '27', label: 'Row 27 and below' },
  { value: '28', label: 'Row 28 and below' },
  { value: '29', label: 'Row 29 and below' },
  { value: '30', label: 'Row 30 and below' },
  { value: '31', label: 'Row 31 and below' },
  { value: '32', label: 'Row 32 and below' }
];

export const TICKET_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: '1 Ticket' },
  { value: 2, label: '2 Tickets' },
  { value: 3, label: '3 Tickets' },
  { value: 4, label: '4 Tickets' },
  { value: 5, label: '5 Tickets' },
  { value: 6, label: '6 Tickets' },
  { value: 7, label: '7 Tickets' },
  { value: 8, label: '8 Tickets' },
  { value: 9, label: '9 Tickets' }
];
