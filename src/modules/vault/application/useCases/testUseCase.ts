import { injectable } from "tsyringe";

@injectable()
export class TestUseCase {
  constructor() {
    console.log("Hello, World!");
  }
}
