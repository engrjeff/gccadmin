import { BarList, Bold, Flex, Text } from "@tremor/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getLeadersData } from "../service"

async function LeadersData() {
  const { leadersData, totalDisciples } = await getLeadersData()

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Leader&apos;s Data</CardTitle>
        <CardDescription className="text-3xl font-bold text-foreground">
          {totalDisciples}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            total disciples
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex className="mt-4">
          <Text className="text-muted-foreground">
            <Bold>Leader</Bold>
          </Text>
          <Text className="text-muted-foreground">
            <Bold>Disciples</Bold>
          </Text>
        </Flex>
        <BarList
          color="sky"
          data={leadersData.map((d) => ({ ...d, value: d._count.disciples }))}
          className="mt-2"
        />
      </CardContent>
    </Card>
  )
}

export default LeadersData
