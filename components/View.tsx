import { unstable_after as after } from "next/server";

import Ping from "./Ping";

import { pluralizeWord } from "@/lib/utils";

import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";

const View = async ({ id }: { id: string }) => {
  const views = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // Update page view on each page visit
  after(async () => {
    await writeClient
      .patch(id)
      .set(views ? { views: views.views! + 1 } : { views: 1 }) // Increment by 1
      .commit();
  });

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">
          {views?.views} {pluralizeWord("View", views?.views as number)}
        </span>
      </p>
    </div>
  );
};

export default View;
