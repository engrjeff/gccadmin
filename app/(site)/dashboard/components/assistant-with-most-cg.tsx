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

  const percentage = (totalMostAssisted / totalCGs) * 100

  return (
    <Card className="border shadow-none">
      <CardHeader className="p-4 lg:p-4">
        <CardTitle className="text-base">Disciples With Cell Groups</CardTitle>
        {totalCGs > 0 ? (
          <>
            <Flex>
              <Text>
                They handled {totalMostAssisted} &bull; {percentage.toFixed(0)}%
              </Text>
              <Text>of {totalCGs} cellgroups</Text>
            </Flex>
            <ProgressBar value={percentage} color="amber" className="mt-3" />
          </>
        ) : null}
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto px-0 lg:px-0">
        <Table className="max-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Handled CGs</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assistantWithMostCG.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground"
                >
                  No data to show
                </TableCell>
              </TableRow>
            ) : (
              <>
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
                    <TableCell className="text-center">
                      {acg?.assistedCG}
                    </TableCell>
                  </TableRow>
                ))}
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
                    <TableCell className="text-center">
                      {acg?.assistedCG}
                    </TableCell>
                  </TableRow>
                ))}
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
                    <TableCell className="text-center">
                      {acg?.assistedCG}
                    </TableCell>
                  </TableRow>
                ))}
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
                    <TableCell className="text-center">
                      {acg?.assistedCG}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default AssistantWithMostCG
