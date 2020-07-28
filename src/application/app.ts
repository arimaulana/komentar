import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

export async function App() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: "*",
    });

    app.useStaticAssets(join(__dirname, "../../", "public"), {
        prefix: "/public/",
    });

    const PORT = process.env.APP_PORT || 3000;
    await app.listen(PORT, () => console.log(`Server successfully started on port ${PORT}.`));
}
