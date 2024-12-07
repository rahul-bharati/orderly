import "dotenv/config";
import mongoose from "mongoose";

import app from "./app";

const main = async () => {
    const PORT = process.env.PORT || 5000;

    const MONGODB_URI = process.env.MONGODB_URI || '';
    const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || '';

    console.info("Connecting to database...");
    await mongoose.connect(MONGODB_URI.replace('<MONGODB_PASSWORD>', MONGODB_PASSWORD));
    console.info("Database connected successfully");

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main().catch(console.error);