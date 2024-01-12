"use client"

import { Table } from "@tanstack/react-table"
import { ListFilter } from "lucide-react"

import { Option } from "@/types/common"
import { cellStatuses, churchStatuses, processLevels } from "@/lib/constants"
import { useIsAdmin } from "@/hooks/use-isadmin"
import { Button } from "@/components/ui/button"
import { MobileFacetedFilter } from "@/components/ui/data-table/mobile-faceted-filter"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import RenderIf from "@/components/render-if"

import { DiscipleWithLeader } from "./columns"

interface DiscipleMobileFiltersProps {
  table: Table<DiscipleWithLeader>
  leadersOptions: Option[]
}

function DiscipleMobileFacetFilters({
  table,
  leadersOptions,
}: DiscipleMobileFiltersProps) {
  const { isAdmin } = useIsAdmin()

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="sr-only">filter</span>
          <ListFilter className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-h-[80vh] overflow-y-auto ">
          <DrawerHeader className="text-left">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>
              Narrow down the list by these filters
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-3 px-4">
            <RenderIf condition={isAdmin}>
              <MobileFacetedFilter
                column={table.getColumn("leaderName")}
                title="Leader"
                options={leadersOptions}
              />
            </RenderIf>
            <MobileFacetedFilter
              column={table.getColumn("cell_status")}
              title="Cell Status"
              options={cellStatuses}
            />
            <MobileFacetedFilter
              column={table.getColumn("church_status")}
              title="Church Status"
              options={churchStatuses}
            />
            <MobileFacetedFilter
              column={table.getColumn("process_level")}
              title="Process Level"
              options={processLevels}
            />
          </div>
          <DrawerFooter className="flex flex-row items-center gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => table.resetColumnFilters()}
            >
              Reset
            </Button>
            <DrawerClose asChild>
              <Button className="flex-1">OK</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DiscipleMobileFacetFilters
