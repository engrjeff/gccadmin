import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getPrimaryLeaders } from "@/app/(site)/disciples/service/disciples"

async function PrimaryLeadersSelect() {
  const primaryLeaders = await getPrimaryLeaders()
  return (
    <Select name="leaderId">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a cell leader" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cell Leader</SelectLabel>
          {primaryLeaders.map((leader) => (
            <SelectItem key={leader.id} value={leader.id}>
              {leader.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default PrimaryLeadersSelect
