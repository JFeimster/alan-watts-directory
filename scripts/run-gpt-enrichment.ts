import { main as discoverUrls } from "./discover-gpt-urls";
import { main as validateLinks } from "./validate-gpt-links";
import { main as refreshMetadata } from "./refresh-gpt-metadata";
import { main as generatePlaceholders } from "./generate-gpt-placeholders";
import { main as buildIndex } from "./build-gpt-index";

async function main(): Promise<void> {
  await discoverUrls();
  await validateLinks();
  await refreshMetadata();
  await generatePlaceholders();
  await buildIndex();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
