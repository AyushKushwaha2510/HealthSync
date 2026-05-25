import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {

  constructor(
    private readonly dataSource: DataSource,
  ) { }

  getHello(): string {
    return 'I am building backend for patient and doctor managemnet app';
  }
  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');

      console.log('DB Connected Successfully');

    } catch (err) {

      console.log('DB Connection Failed');

      console.log(err);
    }
  }
}
