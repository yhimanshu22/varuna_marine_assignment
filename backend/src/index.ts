import { createApp } from "./adapters/inbound/http/App";

const PORT = process.env.PORT || 3001;
const app = createApp();

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});
