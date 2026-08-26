import AppAreaChart from "@/components/AppAreaChart/AppAreaChart";
import AppBarChart from "@/components/AppBarChart/AppBarChart";
import AppPIeChart from "@/components/AppPieChart/AppPIeChart";
import CardList from "@/components/CardList/CardList";

const Home = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:col-span-3 2xl:grid-cols-3 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-2">
        <AppBarChart />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg col-span-2">
        <AppPIeChart />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg col-span-2">
        <CardList title={"Popular products"} />
      </div>
    </div>
  );
};

export default Home;
