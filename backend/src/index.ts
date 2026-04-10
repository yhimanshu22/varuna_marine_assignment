import { createApp } from "./adapters/inbound/http/App";
import { Logger } from "./shared/utils/Logger";

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
    Logger.info(`Varuna Marine Platform - Backend successfully initiated on port ${PORT}`);
});
