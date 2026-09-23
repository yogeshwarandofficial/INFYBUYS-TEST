import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(
    @Request() req: any,
    @Body() body: { listingId?: string; sellerId?: string; rating: number; comment?: string }
  ) {
    return this.reviewsService.createReview({
      buyerId: req.user.id,
      listingId: body.listingId,
      sellerId: body.sellerId,
      rating: body.rating,
      comment: body.comment,
    });
  }

  @Get('listing/:listingId')
  async getReviewsForListing(@Param('listingId') listingId: string) {
    return this.reviewsService.getReviewsForListing(listingId);
  }

  @Get('seller/:sellerId')
  async getReviewsForSeller(@Param('sellerId') sellerId: string) {
    return this.reviewsService.getReviewsForSeller(sellerId);
  }
}
