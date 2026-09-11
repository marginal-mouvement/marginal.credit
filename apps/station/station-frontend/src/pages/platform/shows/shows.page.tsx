import { use, useEffect } from "react";
import { CircleX, Plus, RotateCcw } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@marginal.credit/ui/alert.tsx";
import { Button } from "@marginal.credit/ui/button.tsx";
import { Card } from "@marginal.credit/ui/card.tsx";

import { ShowContext } from "../../../core/show/show.context.tsx";
import { Page } from "../../../parts/page.tsx";
import { CreateShowDialog } from "../../../core/show/createShow.dialog.tsx";
import { ShowCard } from "../../../core/show/showCard.tsx";

export const ShowsPage = () => {
  const { shows, fetchShows, createShow, fetchError, retry } = use(ShowContext);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  return (
    <Page title="Platform" muted="Shows">
      {fetchError ? (
        <div className="h-full flex flex-col justify-center gap-4 items-center">
          <div>
            <Alert>
              <CircleX />
              <AlertTitle>Error while trying to fetch shows</AlertTitle>
              <AlertDescription>{fetchError.message}</AlertDescription>
            </Alert>
          </div>
          <Button variant="ghost" onClick={retry}>
            <RotateCcw /> Retry
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
          <CreateShowDialog createShow={createShow}>
            <Card className="cursor-pointer bg-background">
              <div className="flex items-center justify-center gap-2 w-full h-full">
                <Button variant="outline">
                  <Plus /> Create a show
                </Button>
              </div>
            </Card>
          </CreateShowDialog>
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </Page>
  );
};
