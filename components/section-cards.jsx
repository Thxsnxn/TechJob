import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionCards({ data, selectedCard, onCardClick }) {
  /* Card ข้อมูลในDashboard */
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* งานทั้งหมด */}

      {/* card1 */}
      <Card
        className={cn(
          "@container/card cursor-pointer transition-all duration-200 hover:bg-accent/50",
          selectedCard === "totalJobs" && "border-primary ring-1 ring-primary"
        )}
        onClick={() => onCardClick("totalJobs")}
      >
        <CardHeader>
          <CardDescription>{data.totalJobs.label}</CardDescription>
          <CardTitle className="text-2xl  font-bold tabular-nums py-5 @[250px]/card:text-4xl">
            {data.totalJobs.value}
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
          <div
            className={
              data.totalJobs.trend === "up" ? "text-green" : "text-red"
            }
          >
            {data.totalJobs.trendValue}
          </div>
        </CardFooter>
      </Card>

      {/* card2 */}
      <Card
        className={cn(
          "@container/card cursor-pointer transition-all duration-200 hover:bg-accent/50",
          selectedCard === "inProgress" && "border-primary ring-1 ring-primary"
        )}
        onClick={() => onCardClick("inProgress")}
      >
        <CardHeader>
          <CardDescription>{data.inProgress.label}</CardDescription>
          <CardTitle className="text-2xl font-bold py-5  tabular-nums @[250px]/card:text-4xl">
            {data.inProgress.value}
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div
            className={
              data.inProgress.trend === "up" ? "text-green" : "text-red"
            }
          >
            {data.inProgress.trendValue}
          </div>
        </CardFooter>
      </Card>

      {/* card3 - รอดำเนินการ */}
      <Card
        className={cn(
          "@container/card cursor-pointer transition-all duration-200 hover:bg-accent/50",
          selectedCard === "pending" && "border-primary ring-1 ring-primary"
        )}
        onClick={() => onCardClick("pending")}
      >
        <CardHeader>
          <CardDescription>{data.pending.label}</CardDescription>
          <CardTitle className="text-2xl font-bold py-5  tabular-nums @[250px]/card:text-4xl">
            {data.pending.value}
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div
            className={data.pending.trend === "up" ? "text-green" : "text-red"}
          >
            {data.pending.trendValue}
          </div>
        </CardFooter>
      </Card>

      {/* card4 - เสร็จสิ้น */}
      <Card
        className={cn(
          "@container/card cursor-pointer transition-all duration-200 hover:bg-accent/50",
          selectedCard === "completed" && "border-primary ring-1 ring-primary"
        )}
        onClick={() => onCardClick("completed")}
      >
        <CardHeader>
          <CardDescription>{data.completed.label}</CardDescription>
          <CardTitle className="text-2xl font-bold py-5  tabular-nums @[250px]/card:text-4xl">
            {data.completed.value}
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div
            className={
              data.completed.trend === "up" ? "text-green" : "text-red"
            }
          >
            {data.completed.trendValue}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
