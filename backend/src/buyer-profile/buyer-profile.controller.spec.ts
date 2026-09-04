import { Test, TestingModule } from '@nestjs/testing';
import { BuyerProfileController } from './buyer-profile.controller';

describe('BuyerProfileController', () => {
  let controller: BuyerProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyerProfileController],
    }).compile();

    controller = module.get<BuyerProfileController>(BuyerProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
