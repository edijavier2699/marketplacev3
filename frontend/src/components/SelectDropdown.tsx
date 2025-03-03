

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

interface Props {
    label: string,
    dataList: {
        title: string,
        value:string
    }[],
    placeholder: string
}

export const MySelectDropdown = ({label,dataList,placeholder}:Props) => {
    return(
        <Select>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent side="bottom" align="start"> {/* This ensures dropdown opens downwards */}
                <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {dataList.map((item,index)=>(
                    <SelectItem key={index} value={item.value} >{item.title}</SelectItem>
                ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}