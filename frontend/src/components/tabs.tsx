import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  
  interface Tab {
    value: string;
    title: string;
    description: string;
    content: React.ReactNode
  }
  
  interface TabsComponentProps {
    tabs: Tab[]; // Accept an array of Tab objects as propssss
  }
  
  export const TabsComponent: React.FC<TabsComponentProps> = ({ tabs }) => {
    return (
      <Tabs defaultValue={tabs[0]?.value}>
        <TabsList className="grid w-full grid-cols-3 overflow-x-auto md:overflow-visible">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="min-w-[120px] flex-shrink-0 text-center"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent className="overflow-x-auto" key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle className="hidden">{tab.title}</CardTitle>
                <CardDescription className="hidden">{tab.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 overflow-x-auto">
                {tab.content} {/* Render the content passed as a prop */}
              </CardContent>
              <CardFooter>
                {/* Any additional footer content can go here */}
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    );
  };