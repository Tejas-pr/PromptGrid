import { useEffect, useState } from "react";
import { useElysiaClient } from "@/providers/elysiaProvider";
import { Card } from "@/components/ui/card";
import { ArrowRight, Key, Plus } from "lucide-react";
import { useNavigate } from "react-router";

interface DashboardData {
  balance_creadits: number;
  total_api_count: number;
  total_models: number;
  total_providers: number;
}

function DashboardHome() {
  const client = useElysiaClient();
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const dashboardData = await client.dashboard.get();

        const response = dashboardData.data?.response;

        if (!response) {
          setData(null);
          return;
        }

        setData({
          balance_creadits: response.balance_creadits ?? 0,
          total_api_count: response.total_api_count,
          total_models: response.total_models,
          total_providers: response.total_providers,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, [client]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Balance Credits",
      value: data?.balance_creadits ?? 0,
      icon: "💳",
    },
    {
      label: "API Keys",
      value: data?.total_api_count ?? 0,
      icon: "🔑",
    },
    {
      label: "Models",
      value: data?.total_models ?? 0,
      icon: "🤖",
    },
    {
      label: "Providers",
      value: data?.total_providers ?? 0,
      icon: "🔌",
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Metrics Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card
              key={metric.label}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
                <span className="text-2xl">{metric.icon}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Create API Key */}
          <Card
            className="p-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
            onClick={() => navigate("/dashboard/api-keys")}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Key className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Create API Key</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generate a new API key to access our services
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          {/* Create Resource */}
          <Card
            className="p-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
            onClick={() => navigate("/dashboard/credits")}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Plus className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Add Credits</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add a new credits to your account
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
