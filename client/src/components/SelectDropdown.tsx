import Select from 'react-select';

interface SelectDropdownProps {
  defaultIndex: number;
  options: any[];
  onChange: (selectedOption: any) => void;
  instanceId?: string;
  isMulti?: boolean;
}

export default function SelectDropdown(
  { defaultIndex, options, onChange, instanceId, isMulti = false }: SelectDropdownProps
) 
{
  return (
    <Select
      className="flex"
      classNamePrefix="react-select"
      defaultValue={options[defaultIndex]}
      isClearable={false}
      name="color"
      options={options}
      onChange={onChange}
      instanceId={instanceId}
      isMulti={isMulti}
      styles={{
        control: (provided) => ({
          ...provided,
          width: '100%',
          backgroundColor: '#581d1d20',
          borderColor: '#440C0C',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#000',
          },
          borderRadius: '8px',
          fontSize: '16px',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#ffffff',
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: '#00000000',
          border: '1px solid #440C0C',
          borderRadius: '8px',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#4C0000' : state.isFocused ? '#371414' : '#351E1E',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#371414',
          },
        }),
      }}
    />
  )
}