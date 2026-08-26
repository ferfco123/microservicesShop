import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "../ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const ToDoList = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div>
      <h3 className="mb-2">Calendar</h3>
      <div className="mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <CalendarIcon />
              {date ? format(date, "PPP") : "Choose a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border mb-2"
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>

      <ScrollArea className=" h-50 rounded-md border whitespace-nowrap ">
        <div className="flex flex-col w-max space-x-4 p-4 ">
          <Card className="p-4 mt-2">
            <div className="flex items-center gap-6 w-max">
              <Checkbox id="item1" name="terms-checkbox" />
              <label htmlFor="item1">Checkear el box</label>
            </div>
          </Card>
          <Card className="p-4 mt-2">
            <div className="flex items-center gap-6 w-max">
              <Checkbox id="item1" name="terms-checkbox" />
              <label htmlFor="item1">Checkear el box</label>
            </div>
          </Card>{" "}
          <Card className="p-4 mt-2">
            <div className="flex items-center gap-6 w-max">
              <Checkbox id="item1" name="terms-checkbox" />
              <label htmlFor="item1">Checkear el box</label>
            </div>
          </Card>{" "}
          <Card className="p-4 mt-2">
            <div className="flex items-center gap-6 w-max">
              <Checkbox id="item1" name="terms-checkbox" />
              <label htmlFor="item1">Checkear el box</label>
            </div>
          </Card>{" "}
          <Card className="p-4 mt-2">
            <div className="flex items-center gap-6 w-max">
              <Checkbox id="item1" name="terms-checkbox" />
              <label htmlFor="item1">Checkear el box</label>
            </div>
          </Card>{" "}
          <Card className="p-4 mt-2">
            <div className="flex items-center gap-6 w-max">
              <Checkbox id="item1" name="terms-checkbox" />
              <label htmlFor="item1">Checkear el box</label>
            </div>
          </Card>{" "}
          <Card className="p-4 mt-2">
            <div className="flex items-center gap-6 w-max">
              <Checkbox id="item1" name="terms-checkbox" />
              <label htmlFor="item1">Checkear el box</label>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
export default ToDoList;
