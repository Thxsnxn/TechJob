import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {

  /* Card ข้อมูลในDashboard */
  return (
    <div
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* งานทั้งหมด */}

      {/* card1 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Jobs</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums py-5 @[250px]/card:text-4xl">
            248
          </CardTitle>
          <CardAction>
            {/* เปอเซ็นการเติมโต */}
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-green">
            +12% from last month
          </div>
        </CardFooter>
      </Card>


      {/* card2 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>In Progress</CardDescription>
          <CardTitle className="text-2xl font-bold py-5  tabular-nums @[250px]/card:text-4xl">
            42
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-green">
            +8% from last month
          </div>
        </CardFooter>
      </Card>

      {/* card3 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Complete</CardDescription>
          <CardTitle className="text-2xl font-bold py-5  tabular-nums @[250px]/card:text-4xl">
            186
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-green">
            +15% from last month
          </div>
        </CardFooter>
      </Card>

      {/* card4 */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg. Completion</CardDescription>
          <CardTitle className="text-2xl font-bold py-5  tabular-nums @[250px]/card:text-4xl">
            4.5
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-red">
            - 0.8 days improved
          </div>

        </CardFooter>
      </Card>
    </div>
  );
}
