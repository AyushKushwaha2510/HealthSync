import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { seedData } from "db/seeds/data-seed";


@Injectable()
export class SeedService {
    constructor(private readonly connection: DataSource) { }

    async seed(): Promise<void> {

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const manager = queryRunner.manager;
            console.log("Starting seeding...");
            await seedData(manager);
            console.log("Seed completed");
            await queryRunner.commitTransaction();
        } catch (err) {
            console.error("SEED ERROR:", err);
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}