import { useEffect, useState } from "react";
import { useElysiaClient } from "@/providers/elysiaProvider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertCircle,
  Check,
  Loader2,
  Wallet,
  TrendingUp,
  Key,
} from "lucide-react";

/* -------------------- Types -------------------- */

interface CreditsData {
  currentBalance: number;
  creditsAvailable: number;
  totalApiKeys: number;
  perKeyBreakdown: Array<{
    keyName: string;
    creditsUsed: number;
  }>;
}

/* -------------------- Component -------------------- */

export default function Credits() {
  const client = useElysiaClient();

  const [creditsData, setCreditsData] = useState<CreditsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingCredits, setAddingCredits] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    fetchCreditsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- API -------------------- */

  const fetchCreditsData = async () => {
    try {
      setLoading(true);

      const res = await client.dashboard.get();
      const dashboard = res.data?.response;

      if (!dashboard) throw new Error("Invalid dashboard response");

      setCreditsData({
        currentBalance: dashboard.balance_creadits ?? 0,
        creditsAvailable: dashboard.balance_creadits ?? 0,
        totalApiKeys: dashboard.total_api_count,
        perKeyBreakdown: [
          { keyName: "dev", creditsUsed: 0 },
          { keyName: "production", creditsUsed: 250 },
        ],
      });

      setErrorMessage("");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load credits data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async () => {
    if (!creditsData) return;

    try {
      setAddingCredits(true);
      setErrorMessage("");

      const res = await client.payments.onramp.post();

      if (res.data?.message === "Onramp successful") {
        setSuccessMessage("1000 credits added successfully.");

        await fetchCreditsData();
        setOpenDialog(false);

        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setErrorMessage("Failed to add credits.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Onramp failed.");
    } finally {
      setAddingCredits(false);
    }
  };

  /* -------------------- Loading -------------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="w-full h-full px-10 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Credits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage usage and add demo credits.
          </p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size="sm">Add 1000 Credits</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">
                Confirm Onramp
              </DialogTitle>
              <DialogDescription className="text-sm">
                This demo action will add <b>1000 credits</b> to your account.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddCredits} disabled={addingCredits}>
                {addingCredits ? "Processing…" : "Confirm"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="flex items-center gap-3 p-3 rounded-md bg-green-500/10 border border-green-500/20 max-w-3xl">
          <Check className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-3 rounded-md bg-red-500/10 border border-red-500/20 max-w-3xl">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Stats */}
      {creditsData && (
        <div className="grid grid-cols-12 gap-5">
          <Card className="col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="w-4 h-4" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tracking-tight">
              {creditsData.currentBalance.toLocaleString()}
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tracking-tight">
              {creditsData.creditsAvailable.toLocaleString()}
            </CardContent>
          </Card>

          <Card className="col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Key className="w-4 h-4" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tracking-tight">
              {creditsData.totalApiKeys}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Per-key Breakdown */}
      {creditsData && (
        <Card className="max-w-5xl">
          <CardHeader>
            <CardTitle className="text-base">Per-Key Usage</CardTitle>
            <CardDescription className="text-sm">
              Credit usage by API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {creditsData.perKeyBreakdown.map((k) => (
              <div
                key={k.keyName}
                className="flex justify-between border-b pb-2 text-sm"
              >
                <span className="text-muted-foreground">{k.keyName}</span>
                <span className="font-medium">
                  {k.creditsUsed} credits
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}