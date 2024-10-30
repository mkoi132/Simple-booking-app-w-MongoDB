import { Separator } from "@/components/ui/separator";

export function Ref() {
  return (
    <div className="text-center pt-1">
      <div className="space-y-0.5">
        {/* <h4 className="text-sm font-medium leading-none">Notice of use</h4> */}
        <p className="text-xs text-muted-foreground">
          This application is fully powered by open-source projects.
        </p>
      </div>
      <Separator className="grid my-0.5 w-[50%] justify-self-center" />
      <div className="flex h-5 items-center justify-center space-x-4 text-xs">
        <div>Next.js</div>
        <Separator orientation="vertical" />
        <div>shadcn/ui</div>
        <Separator orientation="vertical" />
        <div>tailwindcss</div>
        <Separator orientation="vertical" />
        <div>Node.js</div>
        <Separator orientation="vertical" />
        <div>Express.js</div>
        <Separator orientation="vertical" />
        <div>MongoDB</div>
        <Separator orientation="vertical" />
        <div>React</div>
      </div>
    </div>
  );
}
