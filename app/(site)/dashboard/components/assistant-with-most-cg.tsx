import Link from "next/link"
import { Flex, ProgressBar, Text } from "@tremor/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Props {
  totalCGs: number
  assistantWithMostCG: (
    | {
        id: string
        name: string
        assistedCG: number
      }
    | undefined
  )[]
}

function AssistantWithMostCG({ totalCGs, assistantWithMostCG }: Props) {
  const totalMostAssisted = assistantWithMostCG.reduce(
    (total, curr) => total + curr?.assistedCG!,
    0
  )

  return (
    <Card className="border shadow-none">
      <CardHeader className="p-4 lg:p-4">
        <CardTitle className="text-base">
          Assistants With Most Handled CGs
        </CardTitle>
        <Flex>
          <Text>
            {totalMostAssisted} &bull;{" "}
            {((totalMostAssisted / totalCGs) * 100).toFixed(0)}%
          </Text>
          <Text>of {totalCGs} cellgroups</Text>
        </Flex>
        <ProgressBar value={45} color="amber" className="mt-3" />
      </CardHeader>
      <CardContent className="px-0 lg:px-0">
        <Table className="max-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Assited CGs</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assistantWithMostCG.filter(Boolean).map((acg) => (
              <TableRow key={`row-with-most-assistant-${acg?.id}`}>
                <TableCell>
                  <Link
                    href={`/disciples/${acg?.id}`}
                    className="hover:underline"
                  >
                    {acg?.name}
                  </Link>
                </TableCell>
                <TableCell className="text-center">{acg?.assistedCG}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AssistantWithMostCG
